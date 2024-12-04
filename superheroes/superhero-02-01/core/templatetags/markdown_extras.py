from django import template
import markdown

register = template.Library()

@register.filter
def markdown_to_html(text):
    """Converts Markdown text to HTML."""
    if text:
        return markdown.markdown(text)
    return ""
