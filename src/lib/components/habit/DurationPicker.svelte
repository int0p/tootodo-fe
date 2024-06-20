<script lang="ts">
   import {
      type DateValue,
      getLocalTimeZone,
      today,
   } from "@internationalized/date";
   import { Button, Popover } from "$ui";
   import RangeMonthCalendar from "$lib/components/RangeMonthCalendar.svelte";
   import { createEventDispatcher } from "svelte";
   import {
      CalendarIcon,
      ChevronLeft,
      ChevronRight,
      RotateCcw,
   } from "lucide-svelte";
   import { cn } from "$lib/utils.js";

   const dispatch = createEventDispatcher();

   let todayValue: DateValue | undefined = today(getLocalTimeZone());

   type MonthRange = {
      start: undefined | DateValue;
      end: undefined | DateValue;
   };

   let selectedMonthRange: MonthRange = {
      start: todayValue,
      end: undefined,
   };
   
   let selectingMonthRange: MonthRange = {
      start: todayValue,
      end: undefined,
   };

   function updateDates() {
      dispatch("update", { selectedMonthRange: selectedMonthRange });
   }

   function resetDates() {
      selectedMonthRange = {
         start: todayValue,
         end: undefined,
      };
      updateDates();
   }
</script>

<div
   class="relative flex items-center w-full h-full gap-2 translate-x-4 -translate-y-2"
>
   <!-- 1month-- -->
   <Button
      class="h-8 w-8 !p-1"
      variant="ghost"
      on:click={() => {
         selectedMonthRange.start = selectedMonthRange.start?.subtract({
            months: 1,
         });
         selectedMonthRange.end = selectedMonthRange.end?.subtract({
            months: 1,
         });
         updateDates();
      }}
   >
      <ChevronLeft size={20} />
   </Button>

   <!-- date range picker -->
   <Popover.Root
      openFocus
      onOpenChange={(open) => {
         if (!open) {
            if(selectingMonthRange.start && selectingMonthRange.end){
               selectedMonthRange = selectingMonthRange;
               updateDates();
            }
         }else{
            selectingMonthRange = {
               start: undefined,
               end: undefined,
            };
         }
      }}
   >
      <Popover.Trigger asChild let:builder>
         <Button
            variant="outline"
            class={cn("w-[300px] justify-start text-left font-normal")}
            builders={[builder]}
         >
            <CalendarIcon class="w-4 h-4 mr-2" />
            {#if selectedMonthRange && selectedMonthRange.start}
               {#if selectedMonthRange.end}
                  {selectedMonthRange.start.year}, {selectedMonthRange.start
                     .month} - {selectedMonthRange.end
                     .year},{selectedMonthRange.end.month}
               {:else}
                  {selectedMonthRange.start.year}, {selectedMonthRange.start.month}
               {/if}
            {:else}
               Pick a month
            {/if}
         </Button>
      </Popover.Trigger>
      <Popover.Content class="w-[300px] p-0 translate-y-1" align="start">
         <RangeMonthCalendar bind:value={selectingMonthRange} initValue={selectedMonthRange}/>
      </Popover.Content> 
   </Popover.Root>

   <!-- reset to today -->
   <Button
      variant="secondary"
      class="absolute z-50  translate-x-[306px]  h-6 px-1 shadow"
      on:click={() => {
         resetDates();
      }}
   >
      <RotateCcw size={18} strokeWidth={2.2} />
   </Button>

   <!-- 1month++ -->
   <Button
      class="h-8 w-8 !p-1"
      variant="ghost"
      on:click={() => {
         selectedMonthRange.start = selectedMonthRange.start.add({ months: 1 });
         selectedMonthRange.end = selectedMonthRange.end.add({ months: 1 });
         updateDates();
      }}
   >
      <ChevronRight size={20} />
   </Button>
</div>