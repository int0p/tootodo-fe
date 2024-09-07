import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-cloudflare';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([vitePreprocess({}), preprocessMeltUI()]),
	vitePlugin: {
			inspector: {
				// change shortcut
				toggleKeyCombo: 'meta-shift',
				// hold and release key to toggle inspector mode
				holdMode: true,
				// show or hide the inspector option
				showToggleButton: 'always',
				// inspector position
				toggleButtonPos: 'top-right'
			}
	},
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true,
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),
		alias: {
			'@/*': './path/to/lib/*',
			$ui: 'src/lib/components/ui',
			$components: 'src/lib/components',
			$store: 'src/lib/store'
		}
	}
};
export default config;
