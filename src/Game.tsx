import React, { useState } from 'react';

export default function Game({ supabase }) {
  const [payloads, setPayloads] = useState<any>([]);

  const handler = (payload) => {
    console.log(payload);
    setPayloads((prev) => [...prev, payload.new.word]);
  };

  supabase
    .channel('game_turns')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'game_turns',
        filter: 'game_id=eq.3',
      },
      handler
    )
    .subscribe();

  return (
    <div>
      {payloads.length ? (
        payloads.map((item) => <div key={item}>{item}</div>)
      ) : (
        <div>Empty</div>
      )}
    </div>
  );
}
