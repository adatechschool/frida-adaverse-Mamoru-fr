'use client';

import { Plus } from 'lucide-react';
import { CombinedColors } from '@/content/Colors';
import {useAddProject} from '@/context/AddProjectContext';
import { useSession } from '@/context/SessionContext';
import {redirect} from 'next/navigation';

export default function AddProjectButton() {
  const { toggleModal } = useAddProject();
  const { session } = useSession();

  return (
    <>
      <button
        onClick={() => {
          session ?
          toggleModal()
          :
          alert("Vous devez être connecté pour ajouter un projet.");
          redirect('/connections');
        }}
        className={`flex items-center gap-2 rounded-md ${CombinedColors.button.primary.bg} ${CombinedColors.button.primary.text} px-4 py-2 text-sm font-semibold transition-colors ${CombinedColors.button.primary.hover}`}
        aria-label="Ajouter un projet"
      >
        <Plus className="h-5 w-5" />
        Ajouter un projet
      </button>
    </>
  );
}