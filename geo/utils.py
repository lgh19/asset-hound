import re
from typing import Pattern


def clean_sql(sql_str: str, regex: Pattern = r'[\n\r\t\s]+', repl: str = ' ') -> str:
    """ clears superfluous white space

        fixme: this is real cheap and dirty and could likely break things later.
         look into replacing this or finding a better way to make SQL readable without all the waste
    """
    return re.sub(regex, repl, sql_str).strip()
