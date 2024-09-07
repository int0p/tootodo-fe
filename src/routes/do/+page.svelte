<script lang="ts">
	import { Tabs,  } from "$ui";
	import PageTemplete from "$components/PageTemplete.svelte";
	import {
		endOfMonth,
		getLocalTimeZone,
		startOfWeek,
		today,
	} from "@internationalized/date";
	import {
		WeeklyChat,
		Plan,
		Result,
		ScheduleList,
		ScheduleHeader,
	} from "$components/schedule";
	import Memo from "$components/memo/Memo.svelte";
	import {
		Columns3,
		MessageSquareMore,
		Rows3,
	} from "lucide-svelte";
	import { currentTime} from "$store";
	import { createTreeView } from "@melt-ui/svelte";

	import { SvelteComponent, onMount, setContext, tick } from "svelte";
	import { derived, writable, type Writable } from "svelte/store";
	import { cn, getTaskTreeItems } from "$lib/utils";

	let selectedWeekRange = getContext("selectedWeekRange");
	import { getContext } from "svelte";

	export let data;
	$: tasks = data?.tasks.sort(sort_tasks());

	const treeItems = writable(getTaskTreeItems(tasks) || []);
	$: treeItems.set(getTaskTreeItems(tasks));
	setContext("treeItems", treeItems);

	// treeview
	const ctx = createTreeView({
		defaultExpanded: [],
	});

	const {
		elements: { tree },
	} = ctx;

	setContext("tree", ctx);

	const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	$: monday_date =
		$selectedWeekRange.start.day ||
		startOfWeek(today(getLocalTimeZone()), "fr-FR").day;

	function sort_tasks() {
		// duration 기준으로 정렬 (start_date가 빠른 것부터 정렬 -> end_date가 느린것부터 정렬)
		return (a, b) => {
			const diff = new Date(a.start_date) - new Date(b.start_date);
			if (diff === 0) {
				return new Date(b.end_date) - new Date(a.end_date);
			} else {
				return diff;
			}
			11`																								`;
		};
	}

	///////// scroll
	let scrollPosition = { scrollTop: 0 };
	let planComponent: SvelteComponent;
	let scheduleListComponent: SvelteComponent;

	function handleScroll(e) {
		scrollPosition = {
			scrollTop: e.detail.scrollTop,
		};
		scheduleListComponent.updateScrollPosition(scrollPosition);
		planComponent.updateScrollPosition(scrollPosition);
	}

	let openSide = false;
</script>

<PageTemplete {openSide}>
	<!-- side: memo -->
	<div
		slot="side"
		class="flex flex-col w-full h-full px-2 py-1 bg-white shadow"
	>
		<div
			class="h-[calc(100%-4px)] w-full max-w-full py-1.5 border-b-4 border-double border-zinc-400"
		>
			<Memo />
		</div>
	</div>

	<!-- main: schedule-->
	<div
		slot="main"
		class="relative flex w-full h-full max-w-full space-x-2 overflow-auto"
	>
		<div
			{...$tree}
			class="relative flex flex-col pt-1 w-1/3 max-w-[300px] min-w-[220px]"
		>
			<ScheduleHeader bind:openSide></ScheduleHeader>

			<div
				class="flex-col flex border-2 w-full h-[calc(100%-34px)] max-h-[calc(100%-34px)] rounded-lg border-zinc-700"
			>
				<div class="rounded-b-lg pr-1 border-zinc-700 h-[calc(100%-48px)]">
					<ScheduleList
						bind:this={scheduleListComponent}
						on:scroll={handleScroll}
						treeItems={$treeItems}
					/>
				</div>

				<input
					class="h-11 w-full border-2 border-t-[2.5px] px-2 py-1 rounded-t-lg bg-white absolute left-0 z-10 bottom-0 border-zinc-700"
					placeholder="Search & Add Task.."
				/>
			</div>
		</div>

		<div
			class="flex flex-col w-full h-full max-w-full overflow-x-clip border-2 border-zinc-700"
		>
			<!-- weeks Tab -->
			<div class="relative w-full h-full flex justify-between">
				<div
					class="absolute h-10 w-full rounded-lg border-b-[2.5px] border-zinc-700 bg-zinc-100/20"
				></div>
				{#each weeks as week, i}
					<div
						class="mt-2 text-[0.9rem] w-full font-digital font-bold text-center flex flex-col items-center text-zinc-400"
						class:today={i === $currentTime?.getDay() - 1}
					>
						<div class="flex px-1.5 h-6 bg-white">
							<span class="mr-1 h-10">
								{week}
							</span>
							{#if $selectedWeekRange.start.day < $selectedWeekRange.end.day}
								{monday_date + i}
							{:else}
								{endOfMonth($selectedWeekRange.start).day === 31 &&
								monday_date + i > 31
									? monday_date + i - 31
									: endOfMonth($selectedWeekRange.start).day === 30 &&
										  monday_date + i > 30
										? monday_date + i - 30
										: monday_date + i}
							{/if}
						</div>
						{#if i === $currentTime?.getDay() - 1}
							<div
								class="absolute top-[22px] w-[90%] border-2 h-1 rounded-full border-dotted border-zinc-700"
							></div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- schedule Tab-->
			<div class="bg-zinc-100 w-full h-11 flex justify-center">
				<Tabs.Root value="do" class="h-[42px] w-full ">
					<Tabs.List class="w-full border-t-[2.5px] border-zinc-700 ">
						<Tabs.Trigger value="plan" class="w-[100px] translate-y-0.5"
							><Rows3 size={20} class="mr-1.5" />Plan</Tabs.Trigger
						>
						<Tabs.Trigger value="do" class="w-[100px]  translate-y-0.5"
							><MessageSquareMore
								size={20}
								class="mr-1.5"
							/>Do!</Tabs.Trigger
						>
						<Tabs.Trigger
							value="result"
							class="w-[100px]  translate-y-0.5"
							><Columns3 size={20} class="mr-1.5" />Result</Tabs.Trigger
						>
					</Tabs.List>

					<Tabs.Content
						{...$tree}
						value="plan"
						class="-translate-y-[calc(100vh-144px)] w-full  "
					>
						<div class=" h-[calc(100vh-198px)]">
							<Plan
								treeItems={$treeItems}
								bind:scrollPosition
								bind:this={planComponent}
								on:scroll={handleScroll}
							/>
						</div>
					</Tabs.Content>

					<Tabs.Content
						value="do"
						class="-translate-y-[calc(100vh-152px)] h-[calc(100vh-204px)] w-full   "
					>
						<WeeklyChat {tasks} />
					</Tabs.Content>

					<Tabs.Content
						value="result"
						class="-translate-y-[calc(100vh-152px)] h-[calc(100vh-204px)] w-full "
					>
						<Result {tasks} />
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</div>
	</div>
</PageTemplete>

<style>
	.today {
		@apply text-zinc-950 border-[3px] border-double border-zinc-500 -translate-y-1 -z-10;
	}
	.chat {
		@apply fixed z-50 h-[calc(100vh-120px)] w-full  min-w-[250px] rounded-lg  bg-zinc-50 shadow-lg shadow-emerald-950 sm:h-[calc(100vh-80px)];
	}

	.time {
		@apply w-[50px] translate-y-1 scale-90 font-mono text-xs font-light text-zinc-400;
	}

	/* scroll bar */
	::-webkit-scrollbar {
		width: 0.1rem;
		height: 0.4rem;
	}

	::-webkit-scrollbar-track {
		@apply absolute bg-zinc-200/80 rounded-full;
	}

	::-webkit-scrollbar-thumb {
		@apply absolute bg-zinc-600/80 rounded-full;
	}

	::-webkit-scrollbar-thumb:hover {
		@apply absolute bg-zinc-900/80 rounded-full;
	}
</style>
