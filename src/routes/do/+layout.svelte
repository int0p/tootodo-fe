<script lang="ts">
	import {DurationPicker}from "$components/schedule";
	import { type DateRange,getThisWeekRange  } from "$lib/utils";
	import {  writable, type Writable } from "svelte/store";
	import { SvelteComponent, onMount, setContext, tick } from "svelte";
    import { goto } from "$app/navigation";
	
	 export let data;

	// duration select
	const selectedWeekRange: Writable<DateRange> = writable(getThisWeekRange());
	setContext("selectedWeekRange", selectedWeekRange);

	onMount(async () => {
		$selectedWeekRange = getThisWeekRange();
		await setQuery($selectedWeekRange);
	});

	async function setQuery(duration) {
		const start_date = duration.start;
		const end_date = duration.end;
		const searchParams = new URLSearchParams({ start_date, end_date });
		await goto(`?${searchParams.toString()}`);
		await tick();
	}

	async function handleDateUpdate(e) {
		const { selectedWeekRange } = e.detail;
		await setQuery(selectedWeekRange);
		$selectedWeekRange = selectedWeekRange;
	}

</script>

<div class="flex flex-col justify-center w-full h-full sm:absolute sm:top-0">
	<!-- header: select date -->
	<div class="w-full h-10 translate-y-1 ">
		<DurationPicker on:update={handleDateUpdate} />
	</div>

	<div class="h-[calc(100%-60px)] w-full">		
		<slot />
	</div>
</div>
