/**
 * EXPORT.JS - Impressão, Download de Imagem (PNG) e Download em PDF com Margens Perfeitas
 */

class ExportManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const btnMoreActions = document.getElementById('btn-more-actions');
    const dropdownMoreActions = document.getElementById('more-actions-dropdown');

    if (btnMoreActions && dropdownMoreActions) {
      btnMoreActions.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('month-team-dropdown')?.classList.add('hidden');
        dropdownMoreActions.classList.toggle('hidden');
        if (window.lucide) window.lucide.createIcons();
      });
    }

    const btnMonthTeamGroup = document.getElementById('btn-month-team-group');
    const dropdownMonthTeam = document.getElementById('month-team-dropdown');

    if (btnMonthTeamGroup && dropdownMonthTeam) {
      btnMonthTeamGroup.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('more-actions-dropdown')?.classList.add('hidden');
        dropdownMonthTeam.classList.toggle('hidden');
        if (window.lucide) window.lucide.createIcons();
      });
    }

    document.addEventListener('click', (e) => {
      if (dropdownMoreActions && !e.target.closest('#btn-more-actions') && !e.target.closest('#more-actions-dropdown')) {
        dropdownMoreActions.classList.add('hidden');
      }
      if (dropdownMonthTeam && !e.target.closest('#btn-month-team-group') && !e.target.closest('#month-team-dropdown')) {
        dropdownMonthTeam.classList.add('hidden');
      }
    });

    const btnPrint = document.getElementById('btn-print');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        if (dropdown) dropdown.classList.add('hidden');
        this.printCalendar();
      });
    }

    const btnImg = document.getElementById('btn-export-img');
    if (btnImg) {
      btnImg.addEventListener('click', () => {
        if (dropdown) dropdown.classList.add('hidden');
        this.exportAsImage();
      });
    }

    const btnPdf = document.getElementById('btn-export-pdf');
    if (btnPdf) {
      btnPdf.addEventListener('click', () => {
        if (dropdown) dropdown.classList.add('hidden');
        this.exportAsPDF();
      });
    }
  }

  getFilename(ext) {
    const monthTitle = document.getElementById('current-month-display').textContent.replace(/[\/\s]/g, '-');
    return `Escala-Farmacia-${monthTitle}.${ext}`;
  }

  printCalendar() {
    window.print();
  }

  async exportAsImage() {
    const element = document.querySelector('.calendar-card');
    if (!element) return;

    window.app.showToast('Gerando imagem em alta resolução...', 'info');

    try {
      const canvas = await window.html2canvas(element, {
        scale: 2.5, // Ultra nitidez
        useCORS: true,
        backgroundColor: '#090d16', // Fundo Dark elegante
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = this.getFilename('png');
      link.href = imgData;
      link.click();

      window.app.showToast('Imagem baixada com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
      window.app.showToast('Erro ao exportar imagem.', 'error');
    }
  }

  async exportAsPDF() {
    const element = document.querySelector('.calendar-card');
    if (!element) return;

    window.app.showToast('Gerando documento PDF...', 'info');

    try {
      const canvas = await window.html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#090d16',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Margem uniforme
      const margin = 8;
      const printableWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * printableWidth) / canvas.width;

      pdf.setFillColor(9, 13, 22); // Fundo dark
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.addImage(imgData, 'PNG', margin, margin, printableWidth, Math.min(imgHeight, pageHeight - (margin * 2)));
      pdf.save(this.getFilename('pdf'));

      window.app.showToast('PDF baixado com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      window.app.showToast('Erro ao exportar PDF.', 'error');
    }
  }
}

window.ExportManager = ExportManager;
