import { Router } from "express";


/**
 * @public
 */
export interface OpenSeaRouterOptions {
    /**
     * NFT Router metadata
     */
    openSeaApiKey: string
    routePrefix: string
}

/**
 * Creates a router for resolving NFTs
 *
 * @param options - Initialization option
 * @returns Expressjs router
 */
export const OpenSeaRouter = (options: OpenSeaRouterOptions): Router => {
    const router = Router()

    router.get('/*', async (req, res) => {
        try {
            // Remove the routePrefix from the original URL
            const api_query = req.originalUrl.replace(options.routePrefix, '')

            const api_res = await fetch(`https://api.opensea.io/api/v1${api_query}`, {
                headers: { 'X-API-KEY': options.openSeaApiKey }
            })

            res.status(api_res.status)
            res.json(await api_res.json())
        } catch (e) {
            res.status(400)
            res.send(e.message)
        }
    })

    return router
}
