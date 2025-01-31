export class MissingNecessaryInfoError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'MissingNecessaryInfoError'
    }
} 