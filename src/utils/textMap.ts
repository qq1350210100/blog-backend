interface MAPTOBOOLEAN {
	(key: string): (boolean | string)
}

export const mapToBoolean: MAPTOBOOLEAN = key => {
	interface VALUES {
		trues: string[]
		falses: string[]
	}
	const values: VALUES = {
		trues: ['true', 'Y', 'y', '1'],
		falses: ['false', 'N', 'n', '0']
	}
	const belongToTrue: boolean = values.trues.some(item => key === item)
	const belongToFalse: boolean = values.falses.some(item => item === key)
	if (belongToTrue) {
		return true
	} else if (belongToFalse) {
		return false
	} else {
		return key
	}
}

