/**
 * Centers text within a given width, padding with spaces
 *
 * @param text - The text to center
 * @param width - The total width to center within (default: 80)
 * @param paddingChar - Character to use for padding (default: ' ')
 * @returns Centered text string
 */
export function centerText(text: string, width: number = 80, paddingChar: string = ' '): string {
  if (text.length >= width) {
    return text
  }

  const totalPadding = width - text.length
  const leftPadding = Math.floor(totalPadding / 2)
  const rightPadding = totalPadding - leftPadding

  return (paddingChar.repeat(leftPadding) + text + paddingChar.repeat(rightPadding)).trimEnd()
}

/**
 * Centers text with custom left and right decorations
 *
 * @param text - The text to center
 * @param width - The total width to center within (default: 80)
 * @param leftChar - Character for left decoration (default: '')
 * @param rightChar - Character for right decoration (default: '')
 * @param paddingChar - Character to use for padding (default: ' ')
 * @returns Centered text with decorations
 */
export function centerTextWithDecorations(
  text: string,
  width: number = 80,
  leftChar: string = '',
  rightChar: string = '',
  paddingChar: string = ' ',
): string {
  const decoratedText = leftChar + text + rightChar
  return centerText(decoratedText, width, paddingChar)
}

/**
 * Creates a horizontal line with optional decorations
 *
 * @param width - The width of the line (default: 80)
 * @param char - Character to use for the line (default: '═')
 * @param leftDecoration - Left decoration character (default: '')
 * @param rightDecoration - Right decoration character (default: '')
 * @returns Horizontal line string
 */
export function createHorizontalLine(
  width: number = 80,
  char: string = '═',
  leftDecoration: string = '',
  rightDecoration: string = '',
): string {
  const lineWidth = width - leftDecoration.length - rightDecoration.length
  return (leftDecoration + char.repeat(lineWidth) + rightDecoration).trimEnd()
}
