"""add index to task_logs

Revision ID: a688d689359e
Revises: 7bde2700a308
Create Date: 2025-10-16 19:06:30.021635

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a688d689359e'
down_revision: Union[str, Sequence[str], None] = '7bde2700a308'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_index('idx_tasklog_taskid', 'task_logs', ['task_id'])
    op.create_index('idx_tasklog_timestamp', 'task_logs', ['timestamp'], postgresql_using='btree')

def downgrade():
    op.drop_index('idx_tasklog_taskid', table_name='task_logs')
    op.drop_index('idx_tasklog_timestamp', table_name='task_logs')
