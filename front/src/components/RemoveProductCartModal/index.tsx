import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface RemoveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export default function RemoveProductCartModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: RemoveItemModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Remover produto?
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-2">
            Tem certeza que deseja remover{" "}
            <span className="font-bold text-gray-800">
              {itemName || "este item"}
            </span>{" "}
            do seu carrinho?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Sim, remover
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}