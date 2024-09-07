<script lang="ts">
	import { ToggleGroup, Button } from "$ui";
	import { goto } from "$app/navigation";

	import { page } from "$app/stores";
	import SelectCategory from "$components/SelectCategory.svelte";
    import { getThis3WeeksRange } from "$lib/utils";
	const date_range = getThis3WeeksRange();
	const task_start_date = date_range.start;
	const task_end_date = date_range.end;
	$: selectedPage = $page.url.pathname.split("/")[2];
</script>

<div
	class="flex flex-col items-center justify-center w-full h-full sm:absolute sm:top-0"
>
	<div
		class="relative z-10 flex h-10 w-[calc(100%-460px)] justify-start space-x-2"
	>
		<ToggleGroup.Root
			bind:value={selectedPage}
			class="flex h-full w-[240px] items-center rounded-xl bg-white shadow-md "
		>
			<!-- select item -->			
			<ToggleGroup.Item
				value="tasks"
				aria-label="task"
				class="w-1/3 p-1 ml-2 h-3/4"
			>
				<Button on:click={() => goto(`/too/tasks?start_date=${task_start_date}&end_date=${task_end_date}`)}>Task</Button>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="notes"
				aria-label="note"
				class="w-1/3 p-1 h-3/4"
			>
				<Button on:click={() => goto("/too/notes")}>Note</Button>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="habits"
				aria-label="habit"
				class="w-1/3 p-1 mr-2 h-3/4"
			>
				<Button on:click={() => goto("/too/habits")}>Habit</Button>
			</ToggleGroup.Item>
			
		</ToggleGroup.Root>
	</div>

	<div class="h-[calc(100%-60px)] w-full">
		<slot />
	</div>
</div>
