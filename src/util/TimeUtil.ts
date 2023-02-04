export function millisToString(millis: number) {
	if (millis === -1) {
		return 'Навсегда';
	}

	const day = 86400;

	if (millis / day >= 1) {
		return Math.floor(millis / day) + " д.";
	}

	return Math.floor(millis / 1000 / 60 / 60) + " ч.";
}