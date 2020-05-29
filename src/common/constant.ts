interface ReadonlyObject {
	readonly [key: string]: string
}

/**
 * 请求方法
 */
export const requestMethod: ReadonlyObject = {
	GET: 'get',
	POST: 'post',
	PUT: 'pust',
	DELETE: 'delete',
	OPTION: 'option',
	PATCH: 'patch'
}

export const responseStatus: ReadonlyObject = {
	OK: 'OK',
	FAIL: 'FAIL'
}