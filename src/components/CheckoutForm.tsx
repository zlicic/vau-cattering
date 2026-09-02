import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema, type OrderFormData } from '../schemas/order';
import { useCartStore } from '../store/cart';
import { BUSINESS } from '../config/business';
import { ShoppingCart, AlertCircle, ArrowRight, MessageCircle, Mail, Phone, X } from 'lucide-react';

export default function CheckoutForm() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const clearCart = useCartStore((state) => state.clearCart);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-sand rounded-full flex items-center justify-center animate-pulse">
          <ShoppingCart size={28} className="text-muted" />
        </div>
        <p className="font-body text-muted">Učitavanje...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-sand rounded-full flex items-center justify-center">
          <ShoppingCart size={28} className="text-muted" />
        </div>
        <h2 className="font-display text-2xl text-ink mb-2">Korpa je prazna</h2>
        <p className="font-body text-muted mb-6">Dodajte jela pre nego što nastavite.</p>
        <a
          href={`${import.meta.env.BASE_URL}ponuda`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-burgundy-dark font-display uppercase tracking-widest rounded-xl hover:bg-gold-dark transition-colors"
        >
          Pogledaj ponudu
        </a>
      </div>
    );
  }

  const buildMessage = (data: OrderFormData) => {
    const lines = [
      `VAU Ketering - Nova porudžbina`,
      ``,
      `Ime: ${data.name}`,
      `Adresa: ${data.address}`,
      `Telefon: ${data.phone}`,
    ];

    if (data.companyName) {
      lines.push(`Firma: ${data.companyName}`);
    }
    if (data.companyId) {
      lines.push(`PIB: ${data.companyId}`);
    }

    lines.push(``);
    lines.push(`Stavke:`);
    items.forEach((item) => {
      lines.push(`${item.quantity}x ${item.name} - ${(item.price * item.quantity).toLocaleString('sr-RS')} RSD`);
    });

    lines.push(``);
    lines.push(`Ukupno: ${totalPrice.toLocaleString('sr-RS')} RSD`);

    return lines.join('\n');
  };

  const onSubmit = (data: OrderFormData) => {
    const message = buildMessage(data);
    setOrderMessage(message);
    setShowModal(true);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
    clearCart();
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('VAU Ketering - Nova porudžbina');
    const body = encodeURIComponent(orderMessage);
    window.location.href = `mailto:${BUSINESS.email}?subject=${subject}&body=${body}`;
  };

  const handleCall = () => {
    window.location.href = `tel:${BUSINESS.phone}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Order summary */}
      <div className="bg-white rounded-xl p-6 mb-8 border border-border shadow-sm">
        <h2 className="font-display text-xl text-ink mb-4">Vaša porudžbina</h2>
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between font-body text-sm">
              <span className="text-ink-light">
                {item.quantity}x {item.name}
              </span>
              <span className="text-ink font-medium">
                {(item.price * item.quantity).toLocaleString('sr-RS')} RSD
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-black/5 pt-3 flex items-center justify-between">
          <span className="font-display text-lg text-ink">Ukupno</span>
          <span className="font-display text-xl text-gold">{totalPrice.toLocaleString('sr-RS')} RSD</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="name" className="block font-body text-sm font-medium text-ink mb-1.5">
            Ime i prezime *
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-3.5 bg-sand border border-border rounded-xl font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/20 transition-all"
            placeholder="Unesite vaše ime"
          />
          {errors.name && (
            <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-gold">
              <AlertCircle size={14} /> {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block font-body text-sm font-medium text-ink mb-1.5">
            Adresa dostave *
          </label>
          <input
            id="address"
            type="text"
            {...register('address')}
            className="w-full px-4 py-3.5 bg-sand border border-border rounded-xl font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/20 transition-all"
            placeholder="Unesite adresu"
          />
          {errors.address && (
            <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-gold">
              <AlertCircle size={14} /> {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block font-body text-sm font-medium text-ink mb-1.5">
            Telefon *
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-3.5 bg-sand border border-border rounded-xl font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/20 transition-all"
            placeholder="06x/xxx-xxxx"
          />
          {errors.phone && (
            <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-gold">
              <AlertCircle size={14} /> {errors.phone.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="companyName" className="block font-body text-sm font-medium text-ink mb-1.5">
              Naziv firme
            </label>
            <input
              id="companyName"
              type="text"
              {...register('companyName')}
              className="w-full px-4 py-3.5 bg-sand border border-border rounded-xl font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/20 transition-all"
              placeholder="Opciono"
            />
          </div>
          <div>
            <label htmlFor="companyId" className="block font-body text-sm font-medium text-ink mb-1.5">
              PIB
            </label>
            <input
              id="companyId"
              type="text"
              {...register('companyId')}
              className="w-full px-4 py-3.5 bg-sand border border-border rounded-xl font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/20 transition-all"
              placeholder="Opciono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 bg-gold text-burgundy-dark font-display text-lg uppercase tracking-widest rounded-xl hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold/15"
        >
          <ArrowRight size={20} />
          Završi porudžbinu
        </button>

        <p className="font-body text-xs text-muted text-center">
          Bićete preusmereni na WhatsApp ili možete kopirati porudžbinu i pozvati nas.
        </p>
      </form>

      {/* Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl text-ink">Vaša porudžbina je spremna</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-sand transition-colors"
                aria-label="Zatvori"
              >
                <X size={20} className="text-muted" />
              </button>
            </div>

            <p className="font-body text-sm text-muted mb-4">
              Izaberite način slanja. Ako nemate WhatsApp na ovom uređaju, pošaljite email ili pozovite nas.
            </p>

            <div className="bg-sand rounded-xl p-4 mb-5 border border-border">
              <pre className="font-body text-xs text-ink whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                {orderMessage}
              </pre>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleWhatsApp}
                className="w-full py-3.5 px-4 bg-[#25D366] text-white font-display text-sm uppercase tracking-widest rounded-xl hover:bg-[#1ebe5a] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Otvori u WhatsApp-u
              </button>

              <button
                onClick={handleEmail}
                className="w-full py-3.5 px-4 bg-sand border border-border text-ink font-display text-sm uppercase tracking-widest rounded-xl hover:bg-warm transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Pošalji email
              </button>

              <button
                onClick={handleCall}
                className="w-full py-3.5 px-4 bg-burgundy text-white font-display text-sm uppercase tracking-widest rounded-xl hover:bg-burgundy-dark transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Pozovi nas ({BUSINESS.phone})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
