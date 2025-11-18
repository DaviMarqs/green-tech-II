import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: string;
}

export function SuccessModal({ open, onOpenChange, paymentMethod }: SuccessModalProps) {
  const navigate = useNavigate();

  const handleGoToOrders = () => {
    onOpenChange(false);
    navigate("/my-orders");
  };

  const handleBackToStore = () => {
    onOpenChange(false);
    navigate("/dashboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800">
              Pedido realizado!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Seu pagamento via <strong>{paymentMethod.toUpperCase()}</strong> está
              sendo processado.
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="flex flex-col sm:flex-col gap-2 w-full">
          <Button
            onClick={handleGoToOrders}
            className="w-full bg-green-600 hover:bg-green-700 py-6 text-md font-medium"
          >
            Ver meus pedidos
          </Button>
          <Button
            variant="outline"
            onClick={handleBackToStore}
            className="w-full py-6 text-md font-medium"
          >
            Voltar para o início
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}