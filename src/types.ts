type ButtonProps = {
	children: React.ReactNode;
	onClick?: any;
	className?: string;
};

type ConfirmModalProps = {
	id: string;
	title: string;
	children: React.ReactNode;
	onConfirm: () => void;
	onCancel: () => void;
	confirmButtonText?: string;
	cancelButtonText?: string;
};