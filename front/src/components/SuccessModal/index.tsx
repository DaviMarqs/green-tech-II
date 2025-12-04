import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SuccessModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	paymentMethod: string;
	paymentData?: any;
}

export function SuccessModal({
	open,
	onOpenChange,
	paymentMethod,
	paymentData,
}: SuccessModalProps) {
	const navigate = useNavigate();

	const handleClose = () => {
		onOpenChange(false);
		navigate("/dashboard");
	};

	const handleGoToOrders = () => {
		onOpenChange(false);
		navigate("/my-orders", { state: { newPayment: paymentData } });
	};

	const handleBackToStore = () => {
		onOpenChange(false);
		navigate("/dashboard");
	};

	const handleCopyCode = () => {
		const code =
			paymentData?.metadata?.codigo_pix ||
			paymentData?.metadata?.linha_digitavel;
		if (code) {
			navigator.clipboard.writeText(code);
			toast.success("Código copiado para a área de transferência!");
		}
	};

	const pixCode = paymentData?.metadata?.codigo_pix;
	const boletoCode = paymentData?.metadata?.linha_digitavel;
	const hasCode = pixCode || boletoCode;

	return (
		<Dialog 
			open={open} 
			onOpenChange={handleClose}
			modal={true}
		>
			<DialogContent 
				className="sm:max-w-md text-center"
				onPointerDownOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
				onInteractOutside={(e) => e.preventDefault()}
			>
				<div className="flex flex-col items-center gap-4 py-6">
					<div className="p-3 bg-green-100 rounded-full">
						<CheckCircle2 className="w-12 h-12 text-green-600" />
					</div>

					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-center text-gray-800">
							Pedido realizado!
						</DialogTitle>
						<DialogDescription className="text-center text-gray-600">
							Seu pagamento via <strong>{paymentMethod}</strong> está sendo
							processado.
						</DialogDescription>
					</DialogHeader>

					{hasCode && (
						<div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2 flex flex-col items-center gap-4">
							{pixCode && (
								<div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
									<img
										src="/qrCodePix.jpg"
										alt="QR Code Pix"
										className="w-40 h-40 object-contain"
									/>
								</div>
							)}

							<div className="w-full">
								<p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
									{pixCode ? "Código Pix (Copia e Cola)" : "Linha Digitável"}
								</p>
								<div className="flex items-center gap-2">
									<code className="flex-1 bg-white border border-gray-200 p-2.5 rounded-lg text-xs text-gray-700 break-all font-mono text-left line-clamp-2">
										{pixCode || boletoCode}
									</code>
									<Button
										size="icon"
										variant="outline"
										className="shrink-0 h-10 w-10"
										onClick={handleCopyCode}
										title="Copiar código"
									>
										<Copy className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</div>
					)}
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