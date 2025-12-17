// Custom Docusaurus plugin to fix Webpack configuration for Supabase
module.exports = function (context, options) {
    return {
        name: 'webpack-supabase-fix',
        configureWebpack(config, isServer, utils) {
            const isNodeServer = typeof config.target === 'string' && config.target.includes('node');

            return {
                resolve: {
                    fallback: {
                        // Supabase may attempt to use these Node.js modules
                        buffer: false,
                        crypto: false,
                        stream: false,
                        util: false,
                    },
                },
                // Handle ESM modules from Supabase
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            include: /node_modules\/@supabase/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env'],
                                    plugins: [
                                        '@babel/plugin-transform-modules-commonjs'
                                    ]
                                }
                            }
                        },
                        // Handle ESM modules more broadly
                        {
                            test: /\.m?js/,
                            resolve: {
                                fullySpecified: false,
                            },
                        },
                    ],
                },
                // Ensure proper handling of ESM modules
                experiments: {
                    topLevelAwait: true,
                },
            };
        },
    };
};
