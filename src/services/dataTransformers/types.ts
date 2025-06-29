
export interface DataTransformer<TInput, TOutput> {
  transform(input: TInput): TOutput;
  transformArray(input: TInput[]): TOutput[];
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface TransformationResult<T> {
  data: T | null;
  validation: ValidationResult;
}

export abstract class BaseTransformer<TInput, TOutput> implements DataTransformer<TInput, TOutput> {
  abstract transform(input: TInput): TOutput;
  
  transformArray(input: TInput[]): TOutput[] {
    return input
      .map(item => {
        try {
          return this.transform(item);
        } catch (error) {
          console.error('Transformation error:', error, item);
          return null;
        }
      })
      .filter((item): item is TOutput => item !== null);
  }

  protected validateRequired(value: any, fieldName: string): ValidationResult {
    if (value === null || value === undefined) {
      return {
        isValid: false,
        errors: [`${fieldName} is required`]
      };
    }
    return { isValid: true };
  }

  protected safeTransform<T>(
    input: any,
    transformFn: () => T,
    fallback: T
  ): TransformationResult<T> {
    try {
      const result = transformFn();
      return {
        data: result,
        validation: { isValid: true }
      };
    } catch (error) {
      console.error('Safe transformation failed:', error, input);
      return {
        data: fallback,
        validation: {
          isValid: false,
          errors: [error instanceof Error ? error.message : 'Unknown transformation error']
        }
      };
    }
  }
}
