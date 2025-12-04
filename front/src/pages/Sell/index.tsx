import CreateProductCard from "@/components/CreateProductCard";
import EditProductCard from "@/components/EditProductCard";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserProducts } from "@/hooks/useProducts";
import type { Product } from "@/services/product.service";
import { Edit2 } from "lucide-react";
import { useState } from "react";

export function Sell() {
  const { data: products, loading, error, refetch } = useUserProducts();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
    refetch();
  };

  return (
    <>
      <TopBar />
      <section className="p-8 space-y-10">
        <h1 className="text-3xl font-bold text-gray-800">Painel de Energia</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <CreateProductCard onProductCreated={refetch} />

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Meus Produtos
            </h2>
            {loading && <p className="text-gray-600">Carregando...</p>}
            {error && <p className="text-red-500">Erro ao carregar produtos</p>}
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition relative group bg-white"
                  >
                    <Button
                      onClick={() => handleEditClick(product)}
                      className="absolute top-2 right-2 p-2 bg-green-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-green-700 shadow-md"
                      title="Editar produto"
                    >
                      <Edit2 size={18} />
                    </Button>

                    <h3 className="font-bold text-lg text-gray-800 pr-10">
                      {product.nome}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.descricao}
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-lg font-semibold text-green-600">
                          R$ {product.preco}
                        </p>
                        <p className="text-xs text-gray-500">
                          Estoque: {product.estoque}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                Você ainda não tem produtos cadastrados.
              </p>
            )}
          </div>
        </div>
      </section>

      <Dialog open={editModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Editar Produto
            </DialogTitle>
          </DialogHeader>
          <EditProductCard
            productId={selectedProduct?.id.toString()}
            onClose={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
