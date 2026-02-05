export interface ValidationResult {
    isValid: boolean;
    error?: string;
    // warnings?: string[]; // Future use
}

export interface BackgroundRemovalResult {
    success: boolean;
    cutoutBuffer?: Buffer;
    error?: string;
}
