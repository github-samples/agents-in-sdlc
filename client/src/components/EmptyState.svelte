<script lang="ts">
    let { message }: { message: string } = $props();
</script>

<div class="text-center py-12 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
    <p class="text-slate-300">{message}</p>
</div>
