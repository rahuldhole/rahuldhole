function renderBody(status, content) {
    return `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(content)}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
  `
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const client_id = config.githubClientId || process.env.GITHUB_CLIENT_ID
    const client_secret = config.githubClientSecret || process.env.GITHUB_CLIENT_SECRET

    try {
        const query = getQuery(event)
        const code = query.code

        const response = await fetch(
            'https://github.com/login/oauth/access_token',
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'user-agent': 'nuxt-github-oauth-login',
                    'accept': 'application/json',
                },
                body: JSON.stringify({ client_id, client_secret, code }),
            }
        )

        const result = await response.json()

        if (result.error) {
            return renderBody('error', result)
        }

        const token = result.access_token
        const provider = 'github'

        return renderBody('success', {
            token,
            provider,
        })
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }
})
