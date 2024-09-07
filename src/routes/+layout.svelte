<script lang="ts">
	import "../app.pcss";
	import { Button, Breadcrumb, Avatar, DropdownMenu } from "$ui";
	import HeaderNav from "$components/HeaderNav.svelte";
	import TWindicator from "$components/TWindicator.svelte";
	import { auth, isAuthed, timerOpen, isRefresh } from "$store";
	import { goto } from "$app/navigation";
	import { onDestroy, onMount } from "svelte";
	import { LogOut, Clock, Bell } from "lucide-svelte";
	import { page } from "$app/stores";
	import ShowRecord from "$components/tenMTable/showRecord.svelte";
	import PlanRecord from "$components/tenMTable/planRecord.svelte";

	let showAlarm = false;
	let openTenM = false;

	onMount(async () => {
		const loggedIn = getCookie("logged_in");

		await auth.getUserInfo();

		const interval = setInterval(
			async () => {
				if (loggedIn) {
					await auth.refresh();
					await auth.getUserInfo();
				} else {
					clearInterval(interval);
					//goto("/login", { replaceState: true });
				}
			},
			1000 * 60 * 14,
		);

		if (typeof window !== "undefined")
			document.addEventListener("keydown", handleKeyDown); // keydown 이벤트 리스너 추가
	});

	onDestroy(() => {
		if (typeof window !== "undefined")
			document.removeEventListener("keydown", handleKeyDown); // keydown 이벤트 리스너 제거
	});

	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(";").shift();
	}

	async function handleLogout(e) {
		e.preventDefault();
		try {
			await auth.logout();
		} catch (error) {
			errorMessage = error.message;
		}
	}

	function handleKeyDown(event) {
		if (event.key === "Escape" || event.key === "Esc") {
			// Esc 버튼이 눌렸을 때, openChat을 false로 변경
			openTenM = false;
		}
	}
</script>

{#await auth.refresh() then}
	{#if $isAuthed}
		<div class="relative flex justify-between w-screen h-12">
			<!-- left menu (navigate page) -->
			<div
				class="absolute left-0 z-50 flex h-full w-[200px] items-center space-x-3 rounded-b-2xl rounded-r-2xl bg-zinc-800 px-4"
			>
				<!-- backward/forward page -->
				<HeaderNav />
				<!-- navigation -->
				<Breadcrumb.Root class="absolute left-16">
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link
								href="/too"
								class="text-xl font-bold text-white hover:text-zinc-100"
								><div
									class:currentPage={$page.url.pathname.includes(
										"too",
									)}
								>
									Too
								</div>
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator class="text-zinc-400" />
						<Breadcrumb.Item>
							<Breadcrumb.Link
								href="/do"
								class="text-xl font-bold text-white hover:text-zinc-100"
								><span
									class:currentPage={$page.url.pathname.includes("do")}
									>Do</span
								>
							</Breadcrumb.Link>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>

			<!-- right menu (profile, search, timer) -->
			<div
				class="absolute right-0 z-50 flex h-12 w-[200px] items-center justify-evenly space-x-2 rounded-b-2xl rounded-l-2xl bg-zinc-800 px-4"
			>
				<!-- alerm -->
				<Button
					variant="ghost"
					class="h-8 w-10 !p-1 hover:bg-zinc-900 hover:shadow hover:shadow-zinc-200"
					on:click={() => (showAlarm = !showAlarm)}
				>
					<Bell
						size={26}
						strokeWidth={2}
						color="white"
						fill="#09090b"
						class={showAlarm
							? "scale-1 scale-125 rounded-full bg-zinc-900 shadow-xl shadow-zinc-50"
							: ""}
					/>
					<!-- todo! show alarm -->
				</Button>

				<!-- timer, tenMplanner -->
				<Button
					variant="ghost"
					on:click={() => (openTenM = !openTenM)}
					class={openTenM
						? "-translate-x-1 translate-y-1 scale-105 rounded-full border  border-dotted bg-zinc-900 !p-2 shadow-xl shadow-zinc-500 hover:bg-zinc-900 hover:shadow hover:shadow-zinc-200"
						: "h-8 w-10 !p-1 hover:bg-zinc-900 hover:shadow hover:shadow-zinc-200"}
					><Clock
						size={26}
						color="white"
						fill="#09090b"
						strokeWidth={2}
					/></Button
				>
				<div
					class="fixed z-50 hidden right-0 top-10 w-[470px] translate-y-1 p-0"
					class:openTimer={openTenM}
				>
					<div
						class={$timerOpen
							? " relative m-auto  h-[290px] "
							: "relative m-3 h-[470px] w-[calc(100%-24px)] bg-white border-[6px] border-double border-zinc-900 rounded-lg shadow-lg shadow-zinc-500"}
					>
						<ShowRecord />
						<div class="absolute top-0 w-full h-full">
							<!-- plan record and start timer directly -->
							<PlanRecord />
						</div>
					</div>
				</div>

				<!-- profile -->
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="ghost"
							class="w-8 h-8 hover:bg-zinc-950 "
							><Avatar.Root
								class="w-8 h-8 border-2 shadow-lg text-zinc-500"
							>
								<Avatar.Image src="/{$auth.photo}" alt={$auth.email} />
								<Avatar.Fallback class="font-bold bg-black"
									>Hi</Avatar.Fallback
								>
							</Avatar.Root></Button
						>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.Label>{$auth.email}</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item on:click={handleLogout}>
							<LogOut size={18} class="mx-2" />
							Log out
							<!-- <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut> -->
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	{/if}
{/await}

<div class="h-full max-h-[calc(100vh-50px)] w-full">
	<slot />
</div>

<!-- <TWindicator /> -->

<style>
	:global(html, body) {
		height: 100%;
	}

	:global(body) {
		font-family: "Manrope Variable", sans-serif;
	}

	.currentPage {
		@apply underline underline-offset-[3px];
	}

	.openTimer {
		@apply block;
	}

	:root {
		--bg-light-red: 254 242 242;
		--bg-light-orange: 255 247 237;
		--bg-light-amber: 255 251 235;
		--bg-light-yellow: 254 252 232;
		--bg-light-lime: 247 254 231;
		--bg-light-green: 240 253 244;
		--bg-light-emerald: 236 253 245;
		--bg-light-teal: 240 253 250;
		--bg-light-cyan: 236 254 255;
		--bg-light-sky: 240 249 255;
		--bg-light-blue: 239 246 255;
		--bg-light-indigo: 238 242 255;
		--bg-light-violet: 245 243 255;
		--bg-light-purple: 250 245 255;
		--bg-light-fuchsia: 253 244 255;
		--bg-light-pink: 253 242 248;
		--bg-light-rose: 255 241 242;
	}
</style>
