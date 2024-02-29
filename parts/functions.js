function isValidPlatformChatId() {
    return typeof platformChatId === 'string' && /^\d{19}$/.test(platformChatId)
}