'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { QueueEntry } from '@/lib/types';
import { PriorityBadge } from './ui/Badge';
import { Users, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface LiveQueueProps {
  clinicId: string;
  onSelectPatient?: (entry: QueueEntry) => void;
  showReviewBanners?: boolean;
}

export function LiveQueue({ clinicId, onSelectPatient, showReviewBanners = false }: LiveQueueProps) {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueue = async () => {
    const { data } = await supabase
      .from('queue_entries')
      .select(`
        *,
        visit:visits (
          id,
          patient:patients (full_name, age, gender),
          triage_records (priority, confidence, flags, reasoning, review_required)
        )
      `)
      .eq('clinic_id', clinicId)
      .in('status', ['waiting', 'called'])
      .order('position', { ascending: true }); // Base DB order

    if (data) {
      // Client side sub-sorting inside priority buckets
      const sorted = (data as any[]).sort((a, b) => {
        const pMap = { P1: 0, P2: 1, P3: 2 };
        if (pMap[a.priority as keyof typeof pMap] !== pMap[b.priority as keyof typeof pMap]) {
          return pMap[a.priority as keyof typeof pMap] - pMap[b.priority as keyof typeof pMap];
        }
        return new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
      });
      setQueue(sorted);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQueue();

    const channel = supabase.channel('global_queue')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queue_entries', filter: `clinic_id=eq.${clinicId}` },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clinicId]);

  if (isLoading) return <div className="p-8 text-center text-gray-500"><span className="animate-pulse">Loading live queue...</span></div>;
  if (!queue.length) return <div className="p-12 text-center text-gray-500 bg-gray-900 border border-gray-800 rounded-xl">The queue is empty.</div>;

  return (
    <div className="flex flex-col gap-3">
      {queue.map((entry) => {
        const triageData = entry.visit?.triage_records?.[0];
        const isSlightlyEscalated = triageData?.review_required && triageData.confidence < 0.70;

        return (
          <div 
            key={entry.id} 
            className="card-hover flex flex-col p-0 overflow-hidden"
            onClick={() => onSelectPatient && onSelectPatient(entry)}
          >
            {showReviewBanners && isSlightlyEscalated && (
              <div className="review-banner rounded-none px-4 flex justify-between">
                <span>⚠️ AI Confidence Low ({(triageData.confidence * 100).toFixed(0)}%) - Auto-Escalated to P2</span>
                <span className="underline cursor-pointer">Review Flags</span>
              </div>
            )}
            
            <div className="flex items-center justify-between p-4 pl-6">
              <div className="flex items-center gap-6 flex-1">
                <div className="flex flex-col items-center justify-center w-10">
                  <span className="text-xs text-gray-500 font-bold">POS</span>
                  <span className={entry.priority === 'P1' ? 'text-xl font-black text-red-500' : 'text-xl font-black text-white'}>
                    #{entry.position}
                  </span>
                </div>
                
                <div className="h-10 w-[1px] bg-gray-800" />

                <div className="flex flex-col">
                  <span className="font-bold text-white text-lg">{entry.visit?.patient?.full_name}</span>
                  <span className="text-sm text-gray-400">
                    {entry.visit?.patient?.age}y • {entry.visit?.patient?.gender}
                  </span>
                </div>

                <div className="ml-auto flex items-center gap-6">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs text-gray-500 font-medium">Wait Time</span>
                    <span className="text-sm text-white font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {Math.floor((new Date().getTime() - new Date(entry.joined_at).getTime()) / 60000)} mins
                    </span>
                  </div>
                  <PriorityBadge priority={entry.priority} className={clsx(entry.priority === 'P1' && "scale-110")} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
