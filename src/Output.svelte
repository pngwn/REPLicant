<script lang="ts">
	export let compiled: string;

	let iframe: HTMLIFrameElement;

	function update(code: string) {
		iframe.contentWindow.postMessage(code, "*");
	}

	$: iframe && compiled && update(compiled);

	const srcdoc = `
<!doctype html>
<html>
	<head>
		<script type="module">

			window.addEventListener('message', event => {
				console.log(event.data)
			}, false)
		<\/script>
	</head>
	<body></body>
</html>
	`;
</script>

<section><iframe title="Rendered REPL" bind:this={iframe} {srcdoc} /></section>
