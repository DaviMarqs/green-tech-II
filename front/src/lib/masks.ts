export const normalizeCpfCnpj = (value: string | undefined) => {
	if (!value) return "";

	const cleanValue = value.replace(/\D/g, "");

	if (cleanValue.length > 11) {
		return cleanValue
			.replace(/(\d{2})(\d)/, "$1.$2")
			.replace(/(\d{2})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1/$2")
			.replace(/(\d{4})(\d)/, "$1-$2")
			.replace(/(-\d{2})\d+?$/, "$1");
	}

	return cleanValue
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})/, "$1-$2")
		.replace(/(-\d{2})\d+?$/, "$1");
};

export const normalizePhone = (value: string | undefined) => {
	if (!value) return "";

	let cleanValue = value.replace(/\D/g, "");

	if (cleanValue.length > 11) {
		cleanValue = cleanValue.slice(0, 11);
	}

	return cleanValue
		.replace(/(\d{2})(\d)/, "($1) $2")
		.replace(/(\d{5})(\d)/, "$1-$2")
		.replace(/(-\d{4})\d+?$/, "$1");
};

export const normalizeDate = (value: string | undefined) => {
	if (!value) return "";

	let cleanValue = value.replace(/\D/g, "");

	if (cleanValue.length > 8) {
		cleanValue = cleanValue.slice(0, 8);
	}

	return cleanValue
		.replace(/(\d{2})(\d)/, "$1/$2")
		.replace(/(\d{2})(\d)/, "$1/$2");
};

export const isValidDate = (dateString: string) => {
	const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
	if (!regex.test(dateString)) return false;

	const [, day, month, year] = dateString.match(regex) || [];

	const d = Number.parseInt(day, 10);
	const m = Number.parseInt(month, 10);
	const y = Number.parseInt(year, 10);

	const date = new Date(y, m - 1, d);
	const now = new Date();

	if (
		date.getDate() !== d ||
		date.getMonth() + 1 !== m ||
		date.getFullYear() !== y
	) {
		return false;
	}

	// Não permite futuro nem anos muito antigos
	if (date > now || y < 1900) return false;

	return true;
};
