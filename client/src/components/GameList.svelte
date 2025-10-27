<script lang="ts">
    import { onMount } from "svelte";

    interface Game {
        id: number;
        title: string;
        description: string;
        publisher?: { id: number; name: string };
        category?: { id: number; name: string };
        starRating?: number;
    }

    interface Publisher {
        id: number;
        name: string;
        description: string;
        game_count: number;
    }

    interface Category {
        id: number;
        name: string;
        description: string;
        game_count: number;
    }

    export let games: Game[] = [];
    let loading = true;
    let error: string | null = null;
    let publishers: Publisher[] = [];
    let categories: Category[] = [];
    let selectedPublisherId: string = '';
    let selectedCategoryId: string = '';

    const fetchPublishers = async () => {
        try {
            const response = await fetch('/api/publishers');
            if (response.ok) {
                publishers = await response.json();
            }
        } catch (err) {
            console.error('Failed to fetch publishers:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (response.ok) {
                categories = await response.json();
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchGames = async () => {
        loading = true;
        try {
            let url = '/api/games';
            const params = new URLSearchParams();
            
            if (selectedCategoryId) {
                params.append('category_id', selectedCategoryId);
            }
            if (selectedPublisherId) {
                params.append('publisher_id', selectedPublisherId);
            }
            
            if (params.toString()) {
                url += '?' + params.toString();
            }

            const response = await fetch(url);
            if(response.ok) {
                games = await response.json();
            } else {
                error = `Failed to fetch data: ${response.status} ${response.statusText}`;
            }
        } catch (err) {
            error = `Error: ${err instanceof Error ? err.message : String(err)}`;
        } finally {
            loading = false;
        }
    };

    const handleFilterChange = () => {
        fetchGames();
    };

    const clearFilters = () => {
        selectedPublisherId = '';
        selectedCategoryId = '';
        fetchGames();
    };

    onMount(() => {
        fetchPublishers();
        fetchCategories();
        fetchGames();
    });
</script>

<div>
    <h2 class="text-2xl font-medium mb-6 text-slate-100">Featured Games</h2>
    
    <!-- Filter Controls -->
    <div class="mb-6 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
        <div class="flex flex-wrap gap-4 items-end">
            <div class="flex-1 min-w-48">
                <label for="category-filter" class="block text-sm font-medium text-slate-300 mb-2">Filter by Category</label>
                <select 
                    id="category-filter"
                    bind:value={selectedCategoryId}
                    on:change={handleFilterChange}
                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All Categories</option>
                    {#each categories as category}
                        <option value={category.id.toString()}>{category.name}</option>
                    {/each}
                </select>
            </div>
            
            <div class="flex-1 min-w-48">
                <label for="publisher-filter" class="block text-sm font-medium text-slate-300 mb-2">Filter by Publisher</label>
                <select 
                    id="publisher-filter"
                    bind:value={selectedPublisherId}
                    on:change={handleFilterChange}
                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All Publishers</option>
                    {#each publishers as publisher}
                        <option value={publisher.id.toString()}>{publisher.name}</option>
                    {/each}
                </select>
            </div>
            
            <div class="flex-shrink-0">
                <button 
                    on:click={clearFilters}
                    class="px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 border border-slate-500 rounded-lg text-slate-200 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    </div>
    
    {#if loading}
        <!-- loading animation -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each Array(6) as _, i}
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
    {:else if error}
        <!-- error display -->
        <div class="text-center py-12 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
            <p class="text-red-400">{error}</p>
        </div>
    {:else if games.length === 0}
        <!-- no games found -->
        <div class="text-center py-12 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
            <p class="text-slate-300">No games available at the moment.</p>
        </div>
    {:else}
        <!-- game list -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="games-grid">
            {#each games as game (game.id)}
                <a 
                    href={`/game/${game.id}`} 
                    class="group block bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700/50 hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-xl transition-all duration-300 hover:translate-y-[-6px]"
                    data-testid="game-card"
                    data-game-id={game.id}
                    data-game-title={game.title}
                >
                    <div class="p-6 relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div class="relative z-10">
                            <h3 class="text-xl font-semibold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors" data-testid="game-title">{game.title}</h3>
                            
                            {#if game.category || game.publisher}
                                <div class="flex gap-2 mb-3">
                                    {#if game.category}
                                        <span class="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-900/60 text-blue-300" data-testid="game-category">
                                            {game.category.name}
                                        </span>
                                    {/if}
                                    {#if game.publisher}
                                        <span class="text-xs font-medium px-2.5 py-0.5 rounded bg-purple-900/60 text-purple-300" data-testid="game-publisher">
                                            {game.publisher.name}
                                        </span>
                                    {/if}
                                </div>
                            {/if}
                            
                            <p class="text-slate-400 mb-4 text-sm line-clamp-2" data-testid="game-description">{game.description}</p>
                            
                            <div class="mt-4 text-sm text-blue-400 font-medium flex items-center">
                                <span>View details</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>