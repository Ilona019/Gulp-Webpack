const isProduction = process.env.NODE_ENV === "production";

const config = {
	mode: isProduction ? "production" : "development",
	entry: {
		app: "./app/common/scripts/app.js"
	},
	output: {
		filename: "[name].min.js"
    },
    
	devtool: isProduction ? false : "source-map",//складываем в один файл скрипты и стили, он растёт, в браузере указание на маленьки кусочки, где стиль или срипт лежит, для отладки в режиме разработки.
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"]//могли созать отдельный файл в корне babel.config.js
					}
				}
			}
		]
	}
};


module.exports = config;