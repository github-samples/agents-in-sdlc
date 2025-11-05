<script lang="ts">
    import { onMount } from "svelte";
    
    interface Game {
        id: number;
        title: string;
        description: string;
        publisher: {
            id: number;
            name: string;
        } | null;
        category: {
            id: number;
            name: string;
        } | null;
        starRating: number | null;
    }

    let { game = undefined, gameId = 0 }: { game?: Game, gameId?: number } = $props();
    
    let loading = $state(true);
    let error = $state<string | null>(null);
    let gameData = $state<Game | null>(null);
    
    onMount(async () => {
        // If game object is provided directly, use it
        if (game) {
            gameData = game;
            loading = false;
            return;
        }
        
        // Otherwise fetch data using gameId
        if (gameId) {
            try {
                const response = await fetch(`/api/games/${gameId}`);
                if (response.ok) {
                    gameData = await response.json();
                } else {
                    error = `Failed to fetch game: ${response.status} ${response.statusText}`;
                }
            } catch (err) {
                error = `Error: ${err instanceof Error ? err.message : String(err)}`;
            } finally {
                loading = false;
            }
        } else {
            error = "No game ID provided";
            loading = false;
        }
    });

    function renderStarRating(rating: number | null): string {
        if (rating === null) return "Not yet rated";
        
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
    }
</script>

{#if loading}
    <div class="animate-pulse bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden p-6">
        <div class="h-8 bg-slate-700 rounded w-1/2 mb-6"></div>
        <div class="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
        <div class="h-4 bg-slate-700 rounded w-1/2 mb-3"></div>
        <div class="h-4 bg-slate-700 rounded w-full mb-3"></div>
    </div>
{:else if error}
    <div class="bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl p-6">
        {error}
    </div>
{:else if gameData}
    <div class="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden" data-testid="game-details">
        <div class="p-6">
            <div class="flex justify-between items-start flex-wrap gap-3">
                <h1 class="text-3xl font-bold text-slate-100 mb-2" data-testid="game-details-title">{gameData.title}</h1>
                
                {#if gameData.starRating !== null}
                <div class="flex items-center">
                    <span class="bg-blue-500/20 text-blue-400 text-sm px-3 py-1 rounded-full" data-testid="game-rating">
                        <span class="text-yellow-400">{renderStarRating(gameData.starRating)}</span> 
                        {gameData.starRating.toFixed(1)}
                    </span>
                </div>
                {/if}
            </div>
            
            <div class="flex flex-wrap gap-2 mt-4 mb-6">
                {#if gameData.category}
                    <span class="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-900/60 text-blue-300" data-testid="game-details-category">
                        {gameData.category.name}
                    </span>
                {/if}
                {#if gameData.publisher}
                    <span class="text-xs font-medium px-2.5 py-0.5 rounded bg-purple-900/60 text-purple-300" data-testid="game-details-publisher">
                        {gameData.publisher.name}
                    </span>
                {/if}
            </div>
            
            <div class="space-y-4 mt-6">
                <h2 class="text-lg font-semibold text-slate-200 mb-2">About this game</h2>
                <div class="text-slate-400 space-y-4">
                    <p data-testid="game-details-description">{gameData.description}</p>
                </div>
            </div>
            
            <div class="mt-8">
                <button class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex justify-center items-center" data-testid="back-game-button">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                    </svg>
                    Support This Game
                </button>
            </div>
        </div>
    </div>
{:else}
    <div class="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6">
        <p class="text-slate-400">No game information available</p>
    </div>
{/if}