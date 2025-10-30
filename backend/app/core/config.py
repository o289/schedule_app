from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int

    # App
    SECRET_KEY: str
    DEBUG: bool = False
    SECRET_KEY: str
    ALGORITHM: str = "HS256"  # 追加
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # API / Web
    API_PORT: int = 8000
    WEB_PORT: int = 3000

    class Config:
        env_file = ".env"  # プロジェクトルートの.envを読み込む

    # 組み立て用プロパティ
    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def API_BASE_URL(self) -> str:
        return f"http://localhost:{self.API_PORT}"

    @property
    def WEB_BASE_URL(self) -> str:
        return f"http://localhost:{self.WEB_PORT}"


settings = Settings()
