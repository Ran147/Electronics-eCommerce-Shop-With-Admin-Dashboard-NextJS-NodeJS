// tests/admin.api.spec.ts

import request from 'supertest';

// -----------------------------------------------------------------
// VALORES CONFIRMADOS
// -----------------------------------------------------------------
const API_URL = 'http://localhost:3001'; 
const ADMIN_PROTECTED_ROUTE = '/api/users';
const LOGIN_ROUTE = '/api/users/login';
// -----------------------------------------------------------------


describe('Módulo de API de Administrador (CP-ADM)', () => {

  /*
   * =================================================================
   * CP-ADM-006 (Caso 51): ACCESO NO AUTORIZADO A ENDPOINT ADMIN
   * Esta prueba verifica que la ruta de admin rechaza peticiones
   * que no incluyen un token de autenticación.
   * =================================================================
   */
  
  test('CP-ADM-006: Debe fallar con 401 (Unauthorized) si no se envía token', async () => {
    
    // 1. (EJECUCIÓN) Intentamos hacer un GET a /api/users...
    // 2. ...SIN enviar un token de 'Authorization'.
    const response = await request(API_URL)
      .get(ADMIN_PROTECTED_ROUTE); // <-- Sin .set('Authorization', ...)

    // 3. (VERIFICACIÓN)
    // Esperamos un error 401 (Unauthorized), que es el código
    // estándar para "no estás autenticado".
    expect(response.statusCode).toBe(401);
  });


  test('CP-USR-005: Debe actualizar el perfil del usuario (nombre)', async () => {
    
    // --- Datos de Prueba ---
    const userEmail = 'joshuapicado0312@gmail.com';
    const newName = `TestUser${Date.now()}`;
    const userEmailEndpoint = `/api/users/email/${userEmail}`;

    // --- FASE 1: OBTENER (Setup) ---
    // Obtenemos el objeto COMPLETO del usuario
    const getResponse = await request(API_URL).get(userEmailEndpoint);
    
    // Verificamos que lo obtuvimos (esto es un bug de seguridad, pero
    // lo usamos a nuestro favor para la prueba)
    expect(getResponse.statusCode).toBe(200);

    // Guardamos el objeto de usuario completo
    const userObject = getResponse.body;
    
    // Verificamos que obtuvimos un ID
    const userId = userObject.id; 
    expect(userId).toBeDefined();

    // --- FASE 2: MODIFICAR (Preparación) ---
    // Actualizamos solo el nombre en nuestro objeto
    userObject.name = newName;

    // --- FASE 3: ENVIAR (Ejecución) ---
    // Enviamos el objeto COMPLETO Y MODIFICADO de vuelta
    const updateResponse = await request(API_URL)
      .put(`/api/users/${userId}`)
      .send(userObject); 

    // --- FASE 4: VERIFICACIÓN ---
    expect(updateResponse.statusCode).toBe(200);
  });


  /*
   * =================================================================
   * CP-ADM-008 (Caso 53): ADMIN ELIMINA UNA RESEÑA
   * =================================================================
   */
  
  test('CP-ADM-008: Debe eliminar una reseña de producto', async () => {
    
    // --- Datos de Prueba ---
    
    // 1. Necesitamos el ID de una reseña que exista en la BD para eliminarla.
    const reviewIdToDelete = 1;

    // 2. Necesitamos la ruta de API correcta. Estoy ADIVINANDO.
    const REVIEW_ENDPOINT = `/api/reviews/${reviewIdToDelete}`; 

    // --- FASE 1: EJECUCIÓN ---
    // Enviamos la petición DELETE al endpoint
    const response = await request(API_URL)
      .delete(REVIEW_ENDPOINT);

    // --- FASE 2: VERIFICACIÓN ---
    // El resultado esperado es 200 OK
    expect(response.statusCode).toBe(200);

  });

 /*
   * =================================================================
   * CP-ADM-007 (Caso 56): ADMIN ELIMINA UN PRODUCTO
   * =================================================================
   */

  test('CP-ADM-007: Debe crear y luego eliminar un producto', async () => {
    
    // --- FASE 1: SETUP (Crear el producto) ---
    
    // Usamos el CategoryID VÁLIDO de tu JSON de ejemplo
    const validCategoryId = "3117a1b0-6369-491e-8b8b-9fdd5ad9912e";

    const newProduct = {
      // Usamos todos los campos que tu JSON nos mostró
      title: `Producto de Prueba ${Date.now()}`,
      slug: `producto-test-${Date.now()}`,
      description: 'Producto para ser eliminado por el test CP-ADM-007',
      price: 1,
      inStock: 10, // Corregido de 'stock' a 'inStock'
      categoryId: validCategoryId, // Corregido de '1' al UUID
      manufacturer: 'Marca de Prueba', // Campo añadido
      mainImage: 'test-image.webp', // Campo añadido
    };

    const createResponse = await request(API_URL)
      .post('/api/products')
      .send(newProduct);

    // Verificamos que se creó (Esta es la línea que fallaba)
    expect(createResponse.statusCode).toBe(201); // 201 = Created
    
    // Obtenemos el ID del producto recién creado
    // (¡OJO! Tu JSON de producto muestra 'id' como un string "1")
    const productIdToDelete = createResponse.body.id; 
    expect(productIdToDelete).toBeDefined();

    // --- FASE 2: EJECUCIÓN (Eliminar el producto) ---
    const deleteResponse = await request(API_URL)
      .delete(`/api/products/${productIdToDelete}`);

    // --- FASE 3: VERIFICACIÓN ---
    // 1. Verificamos que se eliminó
    expect(deleteResponse.statusCode).toBe(204);

    // 2. Verificamos que ya no existe (debe dar 404)
    const getResponse = await request(API_URL)
      .get(`/api/products/${productIdToDelete}`);
      
    expect(getResponse.statusCode).toBe(404);
  });


  /*
   * =================================================================
   * CP-ADM-009 (Caso 60): SUBIR ARCHIVO INVÁLIDO
   * =================================================================
   */
  
  /**
   * CÓDIGO: CP-ADM-009
   * NOMBRE: Intento de subir archivo no-imagen al endpoint de imágenes.
   */
  test('CP-ADM-009: Debe rechazar un archivo .txt en el endpoint de imágenes', async () => {
    
    // --- FASE 1: EJECUCIÓN (Subir un archivo .txt) ---
    
    // 1. Creamos un 'buffer' de datos que simula ser un archivo .txt
    const invalidFileBuffer = Buffer.from('Este es un archivo de texto plano.');

    // 2. Enviamos la petición POST a /api/images como 'multipart/form-data'
    //    y adjuntamos nuestro archivo inválido.
    //    (Nota: 'image' es el nombre del campo que asumo. 
    //    Tu middleware 'express-fileupload' podría esperar otro nombre)
    const response = await request(API_URL)
      .post('/api/images')
      .attach('image', invalidFileBuffer, {
         filename: 'prueba.txt',
         contentType: 'text/plain'
      });
      // Nota: Esta ruta también está insegura (sin token)

    // --- FASE 2: VERIFICACIÓN ---
    // 3. Verificamos que el servidor rechazó la petición.
    //    para una validación de tipo de archivo fallida.
    expect(response.statusCode).toBe(400);
  });

});
