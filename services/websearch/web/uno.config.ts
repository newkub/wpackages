import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetTypography,
	presetWind4,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	presets: [presetWind4(), presetAttributify(), presetTypography(), presetIcons()],
	transformers: [transformerDirectives(), transformerVariantGroup()],
	theme: {
		colors: {
			bg: "#0b1220",
			panel: "rgba(255,255,255,0.06)",
			border: "rgba(255,255,255,0.14)",
			text: "rgba(255,255,255,0.92)",
			muted: "rgba(255,255,255,0.62)",
			muted2: "rgba(255,255,255,0.45)",
			accent: "#ff8a3d",
			ok: "#2dd4bf",
			err: "#fb7185",
			run: "#60a5fa",
		},
		boxShadow: {
			panel: "0 18px 40px rgba(0,0,0,0.35)",
		},
	},
	shortcuts: {
		"btn":
			"h-9 px-3 rd-2.5 border border-border bg-white/6 text-text cursor-pointer transition-colors hover:bg-white/9 disabled:op-55 disabled:cursor-not-allowed",
		"hl": "bg-accent/22 border border-accent/30 px-1 rd-1.5",
		"panel": "rd-4 border border-border bg-panel shadow-panel",
		"panel-header": "px-3.5 py-3 flex items-center justify-between gap-2 border-b border-white/8",
		"panel-title": "text-13px font-700 text-white/90",
		"muted": "text-12px text-muted2",
		"input":
			"w-full h-9 px-3 rd-3 border border-border bg-black/26 text-text outline-none focus:(border-run/55 ring-3 ring-run/14)",
	},
});
