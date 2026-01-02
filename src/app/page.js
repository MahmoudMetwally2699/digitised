import { getTodos } from '@/app/actions';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
      redirect('/auth/signin');
  }

  let todos = [];
  let dbError = null;

  try {
     todos = await getTodos();
  } catch (error) {
     console.error("Failed to fetch todos:", error);
     dbError = "Could not connect to database. Please ensure MongoDB is running.";
  }

  return (
    <div>
      <div className="header-row">
          <h1 className="title" style={{marginBottom: 0}}>Tasks & Goals</h1>
          <div className="user-profile">
             <div className="user-avatar">
                {session.user?.name ? session.user.name[0].toUpperCase() : 'U'}
             </div>
             <div>
                 <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>{session.user?.name || 'Guest User'}</div>
                 <Link href="/api/auth/signout" style={{fontSize: '0.8rem', color: 'var(--accent-color)'}}>Sign Out</Link>
             </div>
          </div>
      </div>

      {dbError && (
        <div className="card" style={{borderColor: 'var(--danger-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)'}}>
            <h3 style={{color: 'var(--danger-color)', marginBottom: '0.5rem'}}>⚠️ Connection Error</h3>
            <p>{dbError}</p>
        </div>
      )}

      <section className="card" style={{opacity: dbError ? 0.5 : 1, pointerEvents: dbError ? 'none' : 'auto'}}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{fontSize: '1.5rem'}}>✨</span> Create New Task
        </h2>
        <TodoForm />
      </section>

      <section style={{ marginTop: '2rem', opacity: dbError ? 0.5 : 1 }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
          Your Dashboard ({todos.length})
        </h2>

        {todos.length === 0 && !dbError ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📝</div>
            <p>No tasks yet. Start by adding one above!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {todos.map(todo => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
