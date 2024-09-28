const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob-all');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = (env, options) => {
    const devMode = options.mode !== 'production';

    // Plugins Settings for Dev Mode
    const devModePlugins = [
        new MiniCssExtractPlugin({
            filename: './dist/css/[name].css',
        }),
    ];

    // Plugins Settings for Production Mode
    const productionModePlugins = [
        new MiniCssExtractPlugin({
            filename: './dist/css/[name].css',
        }),

        // PurgeCSS on Production Only because of sourcemaps
        new PurgecssPlugin({
            // Update these paths based on your views/templates dir structure
            paths: glob.sync(['./page-templates/**/*.php', '*.php']),
            safelist: [
                'page-loaded',
                'loaded',
                'logo-in',
                'toggle-line-in',
                'is-inview',
                'active',
                'sh-open',
                'open',
                'split-line',
                'c-form',
                'field-wrap',
                'wpcf7-form-control',
                'message-wrap',
                'cf-footer',
                'input',
                'label',
                'asterik',
                'wpcf7-not-valid-tip',
                'textarea',
                'privacy-wrap',
                'wpcf7-checkbox',
                'wpcf7-list-item',
                'wpcf7-list-item-label',
                'wpcf7-list-item-label::before',
                'wpcf7-list-item-label::after',
                'wpcf7',
                'entry-meta',
                'entry-date',
                'published',
                'entry-footer',
                'entry-title',
                'pre',
                'wp-block-code',
                'navigation',
                'post-navigation',
                'nav-links',
                'screen-reader-text',
            ],
        }),
    ];

    return {
        // Define the entry points of our application (can be multiple for different sections of a website)
        entry: {
            home: ['./src/js/home.js', './src/scss/style.scss'],
            // contact: ['./src/js/pages/contact.js', './src/scss/contact.scss'],
            // not_found: ['./src/js/pages/not_found.js', './src/scss/not_found.scss'],
        },

        // Set Web Target
        target: 'web',

        // Define development options
        devtool: devMode ? 'source-map' : undefined,

        // Run Dev Server
        devServer: {
            static: {
                directory: path.join(__dirname),
            },
            liveReload: true,
            port: 9000,
        },

        // Define the destination directory and filenames of compiled resources
        output: {
            publicPath: '/',
            filename: 'dist/js/[name].js',
            // ['dist/js/[name].js', 'dist/css/[name].css']
            path: path.resolve(__dirname),
        },

        // Optimization Rules
        optimization: {
            minimizer: [
                new ESBuildMinifyPlugin({
                    target: 'es2015', // Syntax to compile to (see options below for possible values)
                    css: true,
                }),
            ],
        },

        // Define loaders
        module: {
            rules: [
                // Use babel for JS files
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    loader: 'esbuild-loader',
                    options: {
                        target: 'es2015', // Syntax to compile to (see options below for possible values)
                    },
                },

                // Styles Loader
                {
                    test: /\.[s]?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            // translates CSS into CommonJS modules
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2,
                                sourceMap: true,
                                url: false,
                            },
                        },
                        {
                            // Run postcss actions
                            loader: 'postcss-loader',
                            options: {
                                // `postcssOptions` is needed for postcss 8.x;
                                // if you use postcss 7.x skip the key
                                postcssOptions: {
                                    // postcss plugins, can be exported to postcss.config.js
                                    plugins: function () {
                                        return [require('autoprefixer')];
                                    },
                                },
                            },
                        },
                        {
                            // compiles Sass to CSS
                            loader: 'sass-loader',

                            options: {
                                sourceMap: true,

                                // sassOptions: {
                                //     includePaths: ['./src/scss/style.scss'],
                                //     outputPath: 'dist/css/',
                                //     name: 'style.min.css',
                                // },
                            },
                        },
                    ],
                },
            ],
        },

        // Define used plugins
        plugins: devMode ? devModePlugins : productionModePlugins,
    };
};
