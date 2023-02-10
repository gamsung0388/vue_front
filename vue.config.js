const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	outputDir: '../src/main/resources/static',
	devServer:	{
		port:3030,
		proxy:	{
			'api':	{
				target:	'http://localhost:3000',
				changeOrigin : true
			}
		}
	},

	// configureWebpack:{
	// 	resolve: {
	// 		alias: {
	// 			'BOARD': path.join(__dirname,'src/views')
	// 		}
	// 	}
	// },

	lintOnSave : false,
  	transpileDependencies: true
})
