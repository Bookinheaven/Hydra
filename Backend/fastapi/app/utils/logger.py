import logging
import sys

def setup_logger():
    """Sets up the root logger for the application."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        stream=sys.stdout,
    )
    return logging.getLogger()

logger = setup_logger()