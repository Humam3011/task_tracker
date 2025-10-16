"""fix performed_by type

Revision ID: 8a0e1e04a9b6
Revises: a688d689359e
Create Date: 2025-10-16 20:04:47.243022
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '8a0e1e04a9b6'
down_revision: Union[str, Sequence[str], None] = 'a688d689359e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:

    op.drop_constraint(op.f('task_logs_performed_by_fkey'), 'task_logs', type_='foreignkey')
    """Upgrade schema."""
    op.alter_column('task_logs', 'task_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    op.alter_column('task_logs', 'action',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)

    op.alter_column('task_logs', 'timestamp',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               type_=sa.DateTime(),
               nullable=False,
               existing_server_default=sa.text('now()'))

    # ✅ Fix: add USING clause to cast safely
    op.alter_column('task_logs', 'user_id',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=True,
               postgresql_using="user_id::integer")

    op.alter_column(
        'task_logs',
        'performed_by',
        existing_type=sa.INTEGER(),
        type_=sa.String(),
        existing_nullable=True
    )

    op.drop_index(op.f('idx_tasklog_taskid'), table_name='task_logs')
    op.drop_index(op.f('idx_tasklog_timestamp'), table_name='task_logs')
    op.drop_index(op.f('ix_task_logs_action'), table_name='task_logs')
    op.drop_index(op.f('ix_task_logs_task_id'), table_name='task_logs')

    
    op.create_foreign_key(None, 'task_logs', 'users', ['user_id'], ['id'])

    

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(None, 'task_logs', type_='foreignkey')
    op.create_foreign_key(op.f('task_logs_performed_by_fkey'), 'task_logs', 'users', ['performed_by'], ['id'])

    op.create_index(op.f('ix_task_logs_task_id'), 'task_logs', ['task_id'], unique=False)
    op.create_index(op.f('ix_task_logs_action'), 'task_logs', ['action'], unique=False)
    op.create_index(op.f('idx_tasklog_timestamp'), 'task_logs', ['timestamp'], unique=False)
    op.create_index(op.f('idx_tasklog_taskid'), 'task_logs', ['task_id'], unique=False)

    op.alter_column('task_logs', 'performed_by',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=True)

    op.alter_column('task_logs', 'user_id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=True)

    op.alter_column('task_logs', 'timestamp',
               existing_type=sa.DateTime(),
               type_=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))

    op.alter_column('task_logs', 'action',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)

    op.alter_column('task_logs', 'task_id',
               existing_type=sa.INTEGER(),
               nullable=True)