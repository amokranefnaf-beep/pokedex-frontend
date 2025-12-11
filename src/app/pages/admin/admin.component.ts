import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminStats, LoadResult } from '../../service/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  stats: AdminStats | null = null;
  loading = false;
  loadingMessage = '';
  result: LoadResult | null = null;
  error: string | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Erreur chargement stats', err);
      }
    });
  }

  loadGeneration(gen: number): void {
    if (this.loading) return;

    this.loading = true;
    this.loadingMessage = `Chargement de la Génération ${gen}...`;
    this.result = null;
    this.error = null;

    this.adminService.loadGeneration(gen).subscribe({
      next: (result) => {
        this.result = result;
        this.loading = false;
        this.loadStats(); // Refresh stats
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadRange(from: number, to: number): void {
    if (this.loading) return;

    this.loading = true;
    this.loadingMessage = `Chargement des Pokémon ${from} à ${to}...`;
    this.result = null;
    this.error = null;

    this.adminService.loadRange(from, to).subscribe({
      next: (result) => {
        this.result = result;
        this.loading = false;
        this.loadStats();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadAll(): void {
    if (this.loading) return;

    if (!confirm('Charger tous les 1025 Pokémon ? Cela peut prendre plusieurs minutes.')) {
      return;
    }

    this.loading = true;
    this.loadingMessage = 'Chargement de tous les Pokémon (1025)...';
    this.result = null;
    this.error = null;

    this.adminService.loadAll().subscribe({
      next: (result) => {
        this.result = result;
        this.loading = false;
        this.loadStats();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
