import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool, create_engine
from alembic import context

# 追加: アプリ側の設定をimport
from app.core.config import settings
from app.core.database import BaseTable

#

# Alembicが参照するメタデータ
import app.models 
target_metadata = BaseTable.metadata



# ----- ここから下は変更なしでOK -----

def run_migrations_offline():
    context.configure(
        url=settings.DATABASE_URL,   # ← alembic.iniではなくsettingsから読み込み
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
        compare_server_default=True,
        dialect_opts={"paramstyle": "named"}
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = create_engine(settings.DATABASE_URL, poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_server_default=True,
            compare_type=True
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()