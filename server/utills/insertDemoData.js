const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const demoProducts = [
  {
    id: "1",
    title: "Smart phone",
    price: 22,
    rating: 5,
    description: "This is smart phone description",
    mainImage: "product1.webp",
    slug: "smart-phone-demo",
    manufacturer: "Samsung",
    categoryId: "3117a1b0-6369-491e-8b8b-9fdd5ad9912e",
    inStock: 0,
  },
  {
    id: "2",
    title: "SLR camera",
    price: 24,
    rating: 0,
    description: "This is slr description",
    mainImage: "product2.webp",
    slug: "slr-camera-demo",
    manufacturer: "Canon",
    categoryId: "659a91b9-3ff6-47d5-9830-5e7ac905b961",
    inStock: 0,
  },
  {
    id: "3",
    title: "Mixer grinder",
    price: 25,
    rating: 4,
    description: "This is mixed grinder description",
    mainImage: "product3.webp",
    slug: "mixed-grinder-demo",
    manufacturer: "ZunVolt",
    categoryId: "6c3b8591-b01e-4842-bce1-2f5585bf3a28",
    inStock: 1,
  },
  {
    id: "4",
    title: "Phone gimbal",
    price: 21,
    rating: 5,
    description: "This is phone gimbal description",
    mainImage: "product4.webp",
    slug: "phone-gimbal-demo",
    manufacturer: "Samsung",
    categoryId: "d30b85e2-e544-4f48-8434-33fe0b591579",
    inStock: 1,
  },
  {
    id: "5",
    title: "Tablet keyboard",
    price: 52,
    rating: 4,
    description: "This is tablet keyboard description",
    mainImage: "product5.webp",
    slug: "tablet-keyboard-demo",
    manufacturer: "Samsung",
    categoryId: "ada699e5-e764-4da0-8d3e-18a8c8c5ed24",
    inStock: 1,
  },
  {
    id: "6",
    title: "Wireless earbuds",
    price: 74,
    rating: 3,
    description: "This is earbuds description",
    mainImage: "product6.webp",
    slug: "wireless-earbuds-demo",
    manufacturer: "Samsung",
    categoryId: "1cb9439a-ea47-4a33-913b-e9bf935bcc0b",
    inStock: 1,
  },
  {
    id: "7",
    title: "Party speakers",
    price: 35,
    rating: 5,
    description: "This is party speakers description",
    mainImage: "product7.webp",
    slug: "party-speakers-demo",
    manufacturer: "SOWO",
    categoryId: "7a241318-624f-48f7-9921-1818f6c20d85",
    inStock: 1,
  },
  {
    id: "8",
    title: "Slow juicer",
    price: 69,
    rating: 5,
    description: "Slow juicer desc",
    mainImage: "product8.webp",
    slug: "slow-juicer-demo",
    manufacturer: "Bosch",
    categoryId: "8d2a091c-4b90-4d60-b191-114b895f3e54",
    inStock: 1,
  },
  {
    id: "9",
    title: "Wireless headphones",
    price: 89,
    rating: 3,
    description: "This is wireless headphones description",
    mainImage: "product9.webp",
    slug: "wireless-headphones-demo",
    manufacturer: "Sony",
    categoryId: "4c2cc9ec-7504-4b7c-8ecd-2379a854a423",
    inStock: 1,
  },
  {
    id: "10",
    title: "Smart watch",
    price: 64,
    rating: 3,
    description: "This is smart watch description",
    mainImage: "product10.webp",
    slug: "smart-watch-demo",
    manufacturer: "Samsung",
    categoryId: "a6896b67-197c-4b2a-b5e2-93954474d8b4",
    inStock: 5,
  },
  {
    id: "11",
    title: "Notebook horizon",
    price: 52,
    rating: 5,
    description: "This is notebook description",
    mainImage: "product11.webp",
    slug: "notebook-horizon-demo",
    manufacturer: "HP",
    categoryId: "782e7829-806b-489f-8c3a-2689548d7153",
    inStock: 1,
  },
  {
    id: "12",
    title: "Mens trimmer",
    price: 54,
    rating: 5,
    description: "This is trimmer description",
    mainImage: "product12.webp",
    slug: "mens-trimmer-demo",
    manufacturer: "Gillete",
    categoryId: "313eee86-bc11-4dc1-8cb0-6b2c2a2a1ccb",
    inStock: 0,
  }
];

const demoCategories = [
  { id: "7a241318-624f-48f7-9921-1818f6c20d85", name: "speakers" },
  { id: "313eee86-bc11-4dc1-8cb0-6b2c2a2a1ccb", name: "trimmers" },
  { id: "782e7829-806b-489f-8c3a-2689548d7153", name: "laptops" },
  { id: "a6896b67-197c-4b2a-b5e2-93954474d8b4", name: "watches" },
  { id: "4c2cc9ec-7504-4b7c-8ecd-2379a854a423", name: "headphones" },
  { id: "8d2a091c-4b90-4d60-b191-114b895f3e54", name: "juicers" },
  { id: "1cb9439a-ea47-4a33-913b-e9bf935bcc0b", name: "earbuds" },
  { id: "ada699e5-e764-4da0-8d3e-18a8c8c5ed24", name: "tablets" },
  { id: "d30b85e2-e544-4f48-8434-33fe0b591579", name: "phone-gimbals" },
  { id: "6c3b8591-b01e-4842-bce1-2f5585bf3a28", name: "mixer-grinders" },
  { id: "659a91b9-3ff6-47d5-9830-5e7ac905b961", name: "cameras" },
  { id: "3117a1b0-6369-491e-8b8b-9fdd5ad9912e", name: "smart-phones" },
  { id: "da6413b4-22fd-4fbb-9741-d77580dfdcd5", name: "mouses" },
  { id: "ss6412b4-22fd-4fbb-9741-d77580dfdcd2", name: "computers" },
  { id: "fs6412b4-22fd-4fbb-9741-d77512dfdfa3", name: "printers" }
];

async function insertDemoData() {
  console.log("🌱 Iniciando carga de datos (Con Encriptación)...");

  // 1. Categorías
  await prisma.category.createMany({
    data: demoCategories,
    skipDuplicates: true,
  });
  console.log("✅ Categorías listas.");

  // 2. Productos
  await prisma.product.createMany({
    data: demoProducts,
    skipDuplicates: true,
  });
  console.log("✅ Productos listos.");

  // 3. Usuarios (¡Aquí está la corrección!)
  
  const saltRounds = 5; 
  
  const passwordUser = '12345678';
  const passwordAdmin = 'Santi1240+';
  
  const hashedPasswordUser = await bcrypt.hash(passwordUser, saltRounds);
  const hashedPasswordAdmin = await bcrypt.hash(passwordAdmin, saltRounds);

  // Usuario Estándar (oglabuuglo)
  await prisma.user.upsert({
    where: { email: 'oglabuuglo@gmail.com' },
    update: { password: hashedPasswordUser },
    create: {
        // name: 'Usuario',  <-- ELIMINAR
        // lastname: 'Pruebas', <-- ELIMINAR
        email: 'oglabuuglo@gmail.com',
        password: hashedPasswordUser,
        role: 'user',
        // Si 'emailVerified' o 'image' también fallan, coméntalos también.
        // Por ahora dejémoslos a ver si pasan.
        // emailVerified: new Date(), 
        // image: 'randomuser.jpg'
    }
  });
  console.log("✅ User 'oglabuuglo' inserted/verified!");

  // Usuario Admin (realmadrid)
  await prisma.user.upsert({
    where: { email: 'realmadrid@gmail.com' },
    update: { role: 'admin' },
    create: {
        // name: 'Admin', <-- ELIMINAR
        // lastname: 'User', <-- ELIMINAR
        email: 'realmadrid@gmail.com',
        password: hashedPasswordAdmin,
        role: 'admin',
        // emailVerified: new Date(),
        // image: 'randomuser.jpg'
    }
  });
  console.log("✅ Admin 'realmadrid' inserted/verified!");
// ========================================================================
  // AGREGAR ESTO PARA CORREGIR LOS TESTS (buy.spec, user_management, dashboard_admin)
  // ========================================================================
  
  console.log("🛠️ Insertando datos específicos para Tests E2E...");

  // 1. Usuario "Luis" para tests de Compras (CP-CHK-003 a 008, CP-CAR-010, etc.)
  // Email: luis@gmail.com | Pass: Santi1240+
  await prisma.user.upsert({
    where: { email: 'luis@gmail.com' },
    update: { password: hashedPasswordAdmin }, // Usamos el hash de Santi1240+
    create: {
        email: 'luis@gmail.com',
        password: hashedPasswordAdmin, // Santi1240+
        role: 'user',
        emailVerified: new Date(),
        image: 'randomuser.jpg'
    }
  });
  console.log("✅ Test User 'luis' listo.");

  // 2. Usuario para Test de Eliminación (CP-ADM-005)
  // ID esperado: giKh3f2YIfawQaLSFzNd-
  const deleteUserEmail = 'user_to_delete@test.com';
  const userToDelete = await prisma.user.findUnique({ where: { email: deleteUserEmail } });
  
  if (!userToDelete) {
      // Usamos create en lugar de upsert para poder forzar el ID si el modelo lo permite
      // Si el usuario ya existía con otro ID, lo ideal es borrarlo primero o usar otro email
      await prisma.user.create({
          data: {
              id: 'giKh3f2YIfawQaLSFzNd-', // ID HARDCODEADO REQUERIDO POR EL TEST
              email: deleteUserEmail,
              password: hashedPasswordUser,
              role: 'user',
              emailVerified: new Date(),
              image: 'randomuser.jpg'
          }
      });
      console.log("✅ Test User para eliminar (giKh...) creado.");
  } else {
      // Si ya existe, nos aseguramos que tenga el ID correcto (esto es delicado en SQL, 
      // normalmente create es suficiente si la BD se limpia al reiniciar docker)
      console.log("⚠️ User para eliminar ya existía, saltando creación.");
  }

  // 3. Usuario para Actualización de Password (CP-ADM-006)
  // ID esperado: 4rUBKe9FPZznYgAHOj2xj
  const updatePassEmail = 'user_update_pass@test.com';
  const userToUpdatePass = await prisma.user.findUnique({ where: { email: updatePassEmail } });

  if (!userToUpdatePass) {
      await prisma.user.create({
          data: {
              id: '4rUBKe9FPZznYgAHOj2xj', // ID HARDCODEADO
              email: updatePassEmail,
              password: hashedPasswordUser, // Password inicial "12345678"
              role: 'user',
              emailVerified: new Date(),
          }
      });
      console.log("✅ Test User para update password (4rUB...) creado.");
  } else {
      // Restaurar password para que el test sea idempotente
      await prisma.user.update({
          where: { email: updatePassEmail },
          data: { password: hashedPasswordUser }
      });
      console.log("🔄 Test User update password restaurado.");
  }

  // 4. Usuario para Actualización de Rol (CP-ADM-007)
  // ID esperado: l4WyBff5S_r5Oze1csvMr
  const updateRoleEmail = 'user_update_role@test.com';
  const userToUpdateRole = await prisma.user.findUnique({ where: { email: updateRoleEmail } });

  if (!userToUpdateRole) {
      await prisma.user.create({
          data: {
              id: 'l4WyBff5S_r5Oze1csvMr', // ID HARDCODEADO
              email: updateRoleEmail,
              password: hashedPasswordUser,
              role: 'user', // Empieza como user
              emailVerified: new Date(),
          }
      });
      console.log("✅ Test User para update rol (l4Wy...) creado.");
  } else {
      // Restaurar rol a 'user' para que el test pueda volver a promoverlo a admin
      await prisma.user.update({
          where: { email: updateRoleEmail },
          data: { role: 'user' }
      });
      console.log("🔄 Test User update rol restaurado a 'user'.");
  }


}

insertDemoData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });