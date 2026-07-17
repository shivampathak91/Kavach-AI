from loguru import logger
import sys
from app.config import settings


def setup_logger():
    """Configure application logger"""
    logger.remove()
    
    # Console logger
    logger.add(
        sys.stdout,
        colorize=True,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level=settings.LOG_LEVEL
    )
    
    # File logger
    if settings.LOG_FILE:
        logger.add(
            settings.LOG_FILE,
            rotation="500 MB",
            retention="10 days",
            level=settings.LOG_LEVEL,
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}"
        )
    
    return logger


# Initialize logger
log = setup_logger()
