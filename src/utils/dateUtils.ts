const options = {
  day: 'numeric' as const,
  month: 'short' as const,
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', options);
};

const isoDateFormat =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/gm;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isIsoDateString(value: any): boolean {
  return (
    value != null &&
    typeof value === 'string' &&
    value.match(isoDateFormat) != null
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleDates(body: any): any {
  if (body == null || typeof body !== 'object') {
    return body;
  }

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) {
      body[key] = new Date(value);
    } else if (typeof value === 'object') {
      body[key] = handleDates(value);
    }
  }
  return body;
}
