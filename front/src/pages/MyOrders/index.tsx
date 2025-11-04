import MyProducts from "@/components/MyProducts";
import TopBar from "@/components/TopBar";
 
const dadosMockados = [
    {
      id: 1,
      status: "Aprovado",
      valor: 200,
      forma: "Cartão",
    },
    {
      id: 2,
      status: "Aprovado",
      valor: 200,
      forma: "Cartão",
    },
    {
      id: 3,
      status: "Aprovado",
      valor: 200,
      forma: "Cartão",
    },
    {
      id: 4,
      status: "Aprovado",
      valor: 200,
      forma: "Cartão",
    },
];

export default function MyOrders(){
    return(
        <section className="p-8 space-y-10">
          <TopBar />
          <h1 className="text-3xl font-bold text-gray-800">Meus pedidos</h1>
          <MyProducts dados={dadosMockados} />
        </section>
    )
}