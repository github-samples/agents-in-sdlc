<script lang="ts">
    let { count = 6 }: { count?: number } = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each Array(count) as _, i}
        <div class="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
            <div class="p-6">
                <div class="animate-pulse">
                    <div class="h-6 bg-slate-700 rounded w-3/4 mb-3"></div>
                    <div class="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
                    <div class="h-3 bg-slate-700 rounded w-full mb-3"></div>
                    <div class="h-3 bg-slate-700 rounded w-5/6 mb-4"></div>
                    <div class="h-2 bg-slate-700 rounded-full w-full mb-2"></div>
                    <div class="h-4 bg-slate-700 rounded w-1/4 mt-4"></div>
                </div>
            </div>
        </div>
    {/each}
</div>
