<script lang="ts">
	import { DropdownMenu } from '$ui';
	import { ArrowBigRightDash,  MessageCircle, Package, PackageOpen, Trash2 } from 'lucide-svelte';
	import { createEventDispatcher, getContext } from 'svelte';
	import {type Habit } from "$lib/schema";

	const habits = getContext('habits');
	const statusOption: string = getContext("statusOption");
	let openChat = false;

	const dispatch = createEventDispatcher();
	
	function handleDelete(habit:Habit){
		dispatch('delete', { habit });	
	}

	const dispatchUpdateHabit:Function = getContext('handleUpdateHabit');

	function handleUpdateStatus(habit:Habit,key:string){
		const updateData = {
			[key]:habit.status === "InProgress" ? "Archived" : "InProgress"
		}
		dispatchUpdateHabit({ habit, updateData });
	}

	let tableContainer: HTMLElement;

	function handleScroll() {
		dispatch('scroll', {
			scrollTop: tableContainer.scrollTop,
			scrollLeft: tableContainer.scrollLeft
		});
	}

	export function updateScrollPosition(scrollPosition) {
		if (tableContainer) {
			tableContainer.scrollTop = scrollPosition.scrollTop;
			tableContainer.scrollLeft = scrollPosition.scrollLeft;
		}
	}
</script>

<div
	class="flex flex-col w-6 max-h-full overflow-y-scroll no-scrollbar"
	bind:this={tableContainer}
	on:scroll={handleScroll}
>
	<table class="w-full">
		<tbody>
			{#key habits}
			{#each $habits as habit, i}
			{#if habit.status === $statusOption}
				<tr class="z-10 flex h-[30px] items-center">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<td class="">
								<ArrowBigRightDash color="#3f3f46" strokeWidth={2} size={22} />
							</td>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="border-2 border-double border-zinc-800 " side="right">
							<DropdownMenu.Group class="flex items-center justify-center ">
								<DropdownMenu.Item class="">
									<button on:click={handleUpdateStatus(habit,'status')}>
										{#if habit.status === "InProgress"}
										<Package  size={20}  />
										{:else}
										<PackageOpen size={20} />
										{/if}
									</button>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="">
									<button on:click={()=>openChat = !openChat}><MessageCircle size={20} /></button>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="">
									<button on:click={handleDelete(habit)}><Trash2 size={20} /></button>
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</tr>{/if}
			{/each}
			{/key}
		</tbody>
	</table>
</div>
