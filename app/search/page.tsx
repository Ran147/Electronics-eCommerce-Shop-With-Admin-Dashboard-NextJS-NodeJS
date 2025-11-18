import { ProductItem, SectionTitle } from "@/components";
import React from "react";

interface Props {
  // Tipado más flexible para evitar conflictos con Next.js
  searchParams: { [key: string]: string | string[] | undefined };
}

const SearchPage = async ({ searchParams }: Props) => {
  // 1. Extraemos 'search' de forma segura y nos aseguramos que sea un string
  const searchParam = searchParams?.search;
  const searchText = Array.isArray(searchParam) ? searchParam[0] : searchParam || "";

  // 2. Definimos la URL correcta dependiendo de si estamos en Docker o Local
  const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:3001';

  // 3. Hacemos el fetch usando esa URL dinámica
  const data = await fetch(
    `${apiUrl}/api/search?query=${searchText}`,
    { cache: 'no-store' } // Recomendado para búsquedas (evita caché viejo)
  );

  const products = await data.json();

  return (
    <div>
      <SectionTitle title="Search Page" path="Home | Search" />
      <div className="max-w-screen-2xl mx-auto">
        {searchText && (
          <h3 className="text-4xl text-center py-10 max-sm:text-3xl">
            Showing results for {searchText}
          </h3>
        )}
        <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
          {/* Validamos que products sea un array antes de hacer map */}
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem key={product.id} product={product} color="black" />
            ))
          ) : (
            <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
              No products found for specified query
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;