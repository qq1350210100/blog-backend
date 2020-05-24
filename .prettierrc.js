module.exports = {
	printWidth: 100, //一行的字符数，如果超过会进行换行，默认为80
	tabWidth: 2, //一个tab代表几个空格数
	useTabs: true, //是否使用tab进行缩进，默认为false，表示用空格进行缩减
	singleQuote: true, //字符串是否使用单引号
	semi: false, //行位是否使用分号
	trailingComma: 'none', //是否使用尾逗号，有三个可选值"<none|es5|all>"
	bracketSpacing: true, //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
	arrowParens: 'avoid', // (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
	jsxBracketSameLine: false // 在jsx中把'>' 是否不单独放一行
	// parser: 'babylon' //代码的解析引擎，默认为babylon，与babel相同。
}
