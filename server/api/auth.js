export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const client_id = config.githubClientId || process.env.GITHUB_CLIENT_ID

    try {
        const query = getQuery(event)
        const protocol = getRequestProtocol(event)
        const host = getRequestHost(event)
        const origin = `${protocol}://${host}`

        const redirectUrl = new URL('https://github.com/login/oauth/authorize')
        redirectUrl.searchParams.set('client_id', client_id)
        redirectUrl.searchParams.set('redirect_uri', origin + '/api/callback')
        redirectUrl.searchParams.set('scope', 'repo user')
        redirectUrl.searchParams.set(
            'state',
            crypto.getRandomValues(new Uint8Array(12)).join('')
        )

        return sendRedirect(event, redirectUrl.href, 301)
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }
})
